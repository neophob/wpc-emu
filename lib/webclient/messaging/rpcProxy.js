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
    this.errorCounter = 0;
  }

  getAverageRttMs() {
    let totalRttTimeMs = 0.5;
    this.averageRoundTripTimeArray.forEach((entry) => {
      totalRttTimeMs += entry;
    });
    return parseInt(totalRttTimeMs / NR_OF_RTT_ENTRIES, 10);
  }

  /**
   * wait until a specific message is resolved or reject
   * @param {Any} requestId unique message identifier
   * @param {Number} timeoutMs option timeout, default is 1000ms
   * @param {Boolean} debugMessage optional debug message for rejected messages
   * @returns {Promise} which will be resolved when the ACK message gets in
   */
  waitOnAnswer(requestId, timeoutMs, debugMessage) {
    if (this.pendingAnswers.size >= this.maximalPendingAnswers) {
      console.warn('MAXIMAL_PENDING_ANSWER_EXCEEDED', this.pendingAnswers.size);

      this.pendingAnswers.forEach((pendingAnswer) => {
        this.errorCounter++;
        pendingAnswer.promiseReject(new Error('MAXIMAL_PENDING_ANSWERS_REACHED_' + this.maximalPendingAnswers));
      });
      this.pendingAnswers.clear();
    }

    if (this.pendingAnswers.has(requestId)) {
      console.log('REMOVE DUPLICATE REQUEST');
      const answerToReject = this.pendingAnswers.get(requestId);
      this.pendingAnswers.delete(requestId);
      this.errorCounter++;
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
        this.errorCounter++;
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
   * @returns {Boolean} true if message was handled, false if not
   */
  resolvePendingAnswerIfFoundFor(jsonMessage = {}) {
    if (!this.pendingAnswers.has(jsonMessage.requestId)) {
      console.log('requestId not found', jsonMessage);
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
