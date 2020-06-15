const test = require('ava');
const RpcProxy = require('../../../../lib/webclient/messaging/rpcProxy');
const MESSAGE = require('../../../../lib/webclient/messaging/message');

test.beforeEach((t) => {
  t.context.rpcProxy = RpcProxy.build();
});

test('RpcProxy: send and receive a message', (t) => {
  const rpcProxy = t.context.rpcProxy;
  const requestId = 123;
  const promise = rpcProxy.waitOnAnswer(requestId);

  const isMessageExpected = rpcProxy.resolvePendingAnswerIfFoundFor({ message: MESSAGE.MSG_TYPE_ACK, requestId });

  return promise
    .then((result) => {
      t.deepEqual(result, { message: MESSAGE.MSG_TYPE_ACK, requestId: 123 });
      t.is(isMessageExpected, true);
      t.is(rpcProxy.pendingAnswers.size, 0);
    });
});

test('RpcProxy: send and receive a message, detect error (with reason)', (t) => {
  const rpcProxy = t.context.rpcProxy;
  const requestId = 123;
  const promise = rpcProxy.waitOnAnswer(requestId);

  const isMessageExpected = rpcProxy.resolvePendingAnswerIfFoundFor({ message: MESSAGE.MSG_TYPE_ERROR, requestId, parameter: 'REASON' });

  return promise
    .catch((error) => {
      t.deepEqual(error.message, 'REASON');
      t.is(isMessageExpected, true);
      t.is(rpcProxy.pendingAnswers.size, 0);
    });
});

test('RpcProxy: send and receive a message, detect error (without reason)', (t) => {
  const rpcProxy = t.context.rpcProxy;
  const requestId = 123;
  const promise = rpcProxy.waitOnAnswer(requestId);

  const isMessageExpected = rpcProxy.resolvePendingAnswerIfFoundFor({ message: MESSAGE.MSG_TYPE_ERROR, requestId });

  return promise
    .catch((error) => {
      t.deepEqual(error.message, '123');
      t.is(isMessageExpected, true);
      t.is(rpcProxy.pendingAnswers.size, 0);
    });
});

test('RpcProxy: send indicate that message was not handled', (t) => {
  const rpcProxy = t.context.rpcProxy;

  const isMessageExpected = rpcProxy.resolvePendingAnswerIfFoundFor();

  t.is(isMessageExpected, false);
});

test('RpcProxy: should timeout when no message receieved', (t) => {
  const rpcProxy = t.context.rpcProxy;
  const requestId = 123;
  const promise = rpcProxy.waitOnAnswer(requestId, 1);

  return promise
    .catch((error) => {
      t.is(error.message, 'PROMISE_TIMEOUT_1');
      t.is(rpcProxy.pendingAnswers.size, 0);
    });
});

test('RpcProxy: should handle duplicate, duplicate answers', (t) => {
  const rpcProxy = t.context.rpcProxy;
  const requestId = 123;
  let firstRequestRejected = false;

  const rejectedPromise = rpcProxy.waitOnAnswer(requestId, 1)
    .catch(() => {
      firstRequestRejected = true;
    });

  const resolvedPromise = rpcProxy.waitOnAnswer(requestId);
  const isMessageExpected = rpcProxy.resolvePendingAnswerIfFoundFor({ message: MESSAGE.MSG_TYPE_ACK, requestId });

  return Promise.all([ resolvedPromise, rejectedPromise ])
    .then(() => {
      t.is(isMessageExpected, true);
      t.is(firstRequestRejected, true);
    });
});

test('RpcProxy: clears queue if we each max pending answers', (t) => {
  const rpcProxy = t.context.rpcProxy;
  const requestId = 123;

  const rejectedPromises = (new Array(32)).fill(0).map((value, index) => {
    const pendingPromise = rpcProxy.waitOnAnswer(index + 100000);
    pendingPromise.catch(() => {});
    return pendingPromise;
  });

  const lastPromise = rpcProxy.waitOnAnswer(requestId);
  rpcProxy.resolvePendingAnswerIfFoundFor({ message: MESSAGE.MSG_TYPE_ACK, requestId });
  return Promise.all([ rejectedPromises, lastPromise ])
    .then(() => {
      t.is(rpcProxy.pendingAnswers.size, 0);
    });
});

//TODO RTT TESTS AND ERROR COUNTER TESTS
