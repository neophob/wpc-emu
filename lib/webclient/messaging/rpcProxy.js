'use strict';

module.exports = {
  build,
};

const DEFAULT_MAXIMAL_PENDING_ANSWERS = 32;

function build(maximalPendingAnswers) {
  return new RpcProxy(maximalPendingAnswers);
}

class RpcProxy {

  constructor(maximalPendingAnswers = DEFAULT_MAXIMAL_PENDING_ANSWERS) {
    this.maximalPendingAnswers = maximalPendingAnswers;
    this.pendingAnswers = new Map();
  }

  /**
   * wait until a specific message is resolved or reject
   * @param {*} requestId message identifier
   * @param {*} timeoutM option timeout, default is 1000ms
   */
  waitOnAnswer(requestId, timeoutMs) {
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
        console.warn('REMOVE_REJECTED_RESPONSE', { requestId, msg: error.message });
        this.pendingAnswers.delete(requestId);
        return Promise.reject(error);
      })
      .then((result) => {
        console.log('REMOVE_RESOLVED_RESPONSE', { requestId });
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
    answerFound.promiseResolve(jsonMessage);
    const roundTripTimeMs = Date.now() - answerFound.timestamp;
    console.log('ANSWER_FOUND_ROUND_TRIP_TIME:', { roundTripTimeMs });
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
