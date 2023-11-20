/**
 * 參考 面试官：“你能手写一个 Promise 吗”
 * https://juejin.cn/post/6850037281206566919
 */

const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

function promisey(executor) {
  let status = PENDING;
  let value = undefined;
  let reason = undefined;

  let onResolvedCallbacks = [];
  let onRejectedCallbacks = [];

  function resolve(_value) {
    if (status === PENDING) {
      status = FULFILLED;
      value = _value;
    }

    onResolvedCallbacks.forEach((fn) => fn());
  }

  function reject(_reason) {
    if (status === PENDING) {
      status = REJECTED;
      reason = _reason;
    }

    onRejectedCallbacks.forEach((fn) => fn());
  }

  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }

  function then(onFulfilled, onRejected) {
    if (status === FULFILLED) {
      onFulfilled(value);
    }
    if (status === REJECTED) {
      onRejected(reason);
    }

    if (status === PENDING) {
      onResolvedCallbacks.push(() => {
        onFulfilled(value);
      });
      onRejectedCallbacks.push(() => {
        onRejected(reason);
      });
    }
  }

  return {
    then,
  };
}

// testcase
const promise = promisey((resolve, reject) => {
  setTimeout(() => {
    resolve("成功");
  }, 2000);
}).then(
  (data) => {
    console.log("success", data);
  },
  (err) => {
    console.log("faild", err);
  }
);
