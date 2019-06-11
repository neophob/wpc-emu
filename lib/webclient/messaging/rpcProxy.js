'use strict';

const MESSAGE = require('./message');

module.exports = {
  build,
};

const DEFAULT_MAXIMAL_PENDING_ANSWERS = 32;
const NR_OF_RTT_ENTRIES = 16;

function build(maximalPendingAnswers) {
  return new RpcProxy(maximalPendingAnswers);
}

class RpcProxy {

  constructor(maximalPendingAnswers = DEFAULT_MAXIMAL_PENDING_ANSWERS) {
    this.maximalPendingAnswers = maximalPendingAnswers;
    this.pendingAnswers = new Map();
    this.averageRoundTripTimeArray = new Array(NR_OF_RTT_ENTRIES);
    this.replyCounter = 0;
  }

  getAverageRttMs() {
    let totalRttTimeMs = 0.5;
    this.averageRoundTripTimeArray.forEach(entry => totalRttTimeMs += entry);
    return parseInt(totalRttTimeMs / NR_OF_RTT_ENTRIES, 10);
  }

  /**
   * wait until a specific message is resolved or reject
   * @param {*} requestId message identifier
   * @param {*} timeoutMs option timeout, default is 1000ms
   */
  waitOnAnswer(requestId, timeoutMs, debugMessage) {
    if (this.pendingAnswers.size >= this.maximalPendingAnswers) {
      console.warn('MAXIMAL_PENDING_ANSWER_EXCEEDED', this.pendingAnswers.size);

      this.pendingAnswers.forEach((pendingAnswer) => {
        pendingAnswer.promiseReject(new Error('MAXIMAL_PENDING_ANSWERS_REACHED_' + this.maximalPendingAnswers));
      });
      this.pendingAnswers.clear();
    }

    if (this.pendingAnswers.has(requestId)) {
      console.log('REMOVE DUPLICATE REQUEST');
      const answerToReject = this.pendingAnswers.get(requestId);
      this.pendingAnswers.delete(requestId);
      answerToReject.promiseReject(new Error('DUPLICATE_REQUEST'));
    }

    const answerPromise = new Promise((resolve, reject) => {
      const pendingAnswer = {
        timestamp: Date.now(),
        promiseResolve: resolve,
        promiseReject: reject,
        requestId,
      };
      this.pendingAnswers.set(requestId, pendingAnswer);
    });

    return promiseTimeout(answerPromise, timeoutMs)
      .catch((error) => {
        console.warn('REMOVE_REJECTED_RESPONSE', { requestId, msg: error.message, debugMessage: JSON.stringify(debugMessage) });
        this.pendingAnswers.delete(requestId);
        return Promise.reject(error);
      })
      .then((result) => {
        //console.log('REMOVE_RESOLVED_RESPONSE', { requestId });
        this.pendingAnswers.delete(requestId);
        return result;
      });
  }

  /**
   * signal that message with requestId should be resolved
   * @param {*} jsonMessage must contain requestId
   */
  resolvePendingAnswerIfFoundFor(jsonMessage = {}) {
    if (!this.pendingAnswers.has(jsonMessage.requestId)) {
      console.log('request id not found', jsonMessage.requestId);
      console.log(this.pendingAnswers);
      return false;
    }

    const answerFound = this.pendingAnswers.get(jsonMessage.requestId);

    const index = (this.replyCounter++) % NR_OF_RTT_ENTRIES;
    this.averageRoundTripTimeArray[index] = Date.now() - answerFound.timestamp;

    if (jsonMessage.message === MESSAGE.MSG_TYPE_ERROR) {
      answerFound.promiseReject(new Error(jsonMessage.parameter || answerFound.requestId));
      return true;
    }
    answerFound.promiseResolve(jsonMessage);
    //TODO collect round trip times and expose
    //const roundTripTimeMs = ;
    //console.log('ANSWER_FOUND_ROUND_TRIP_TIME:', { roundTripTimeMs, requestId: jsonMessage.requestId });
    return true;
  }

}

function promiseTimeout(promise, timeoutMs) {
  let timeoutId;
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('PROMISE_TIMEOUT_' + timeoutMs));
    }, timeoutMs);
  });

  return Promise
    .race([ promise, timeoutPromise ])
    .finally(() => {
      clearTimeout(timeoutId);
    });
}
