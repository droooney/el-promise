'use strict';

/* eslint no-nested-ternary: 0 */
/* eslint no-negated-condition: 0 */
var global$1 = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var isFunction = (function (value) {
  return typeof value === 'function';
});

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/**
 * @callback onFulfilledOrRejected
 * @public
 */

/**
 * @callback onRejected
 * @public
 * @param {Error|*} err - Promise error.
 */

/**
 * @callback onFulfilled
 * @public
 * @param {*} value - Promise value.
 */

var secret = {};
var iterator = global$1.Symbol ? global$1.Symbol.iterator : Math.random().toString(36);
var _ref = {};
var toString = _ref.toString;

/**
 * @class Promise
 * @public
 * @param {Function} executor - Function that takes two arguments: resolve and reject functions.
 * Call the resolve function when you need to fulfill the promise and call the reject one
 * when you need to reject it.
 * @returns {Promise} Instance of Promise.
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * @description Class with almost identical API to
 * [ES6 Promise]{@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise}.
 * There is a couple differences: set Promise.onError to a function with which you want to
 * subscribe to a promise error and set Promise.onUnhandledRejection to a function with which
 * you want to subscribe to an unhandled error
 * (defaults to console.error.bind(console, '%s %o', 'Uncaught (in promise)')).
 */

var Promise$1 = function () {
  function Promise(executor) {
    classCallCheck(this, Promise);

    if (!isFunction(executor)) {
      throw new TypeError('Promise resolver ' + toString.call(executor) + ' is not a function');
    }

    var hiddenStatus = void 0;
    var hiddenValue = void 0;

    var onFulfill = [];
    var onReject = [];
    var realPromise = this;
    var hiddenPromise = {
      handled: false,
      get status() {
        return hiddenStatus;
      },
      set status(value) {
        hiddenStatus = value;
        realPromise.status = value;
      },
      get value() {
        return hiddenValue;
      },
      set value(val) {
        hiddenValue = val;
        realPromise.value = val;
      }
    };

    hiddenPromise.status = 'pending';
    hiddenPromise.value = undefined;

    Object.defineProperties(this.$$ = {}, {
      handled: {
        get: function get$$1() {
          return hiddenPromise.handled;
        },
        set: function set$$1(key) {
          if (key === secret) {
            hiddenPromise.handled = true;
          }
        }
      },
      handle: {
        value: function value(status, f, resolve, reject, key) {
          if (key === secret) {
            var proxy = null;

            if (isFunction(f)) {
              proxy = function proxy(value) {
                try {
                  resolve(f(value));
                } catch (err) {
                  reject(err);
                }
              };
            }

            if (status === 'resolve') {
              onFulfill.push(proxy || function (value) {
                return resolve(value);
              });
            } else if (status === 'reject') {
              onReject.push(proxy || function (err) {
                return reject(err);
              });
            }
          }
        }
      },
      status: {
        get: function get$$1() {
          return hiddenPromise.status;
        }
      },
      value: {
        get: function get$$1() {
          return hiddenPromise.value;
        }
      }
    });

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }

    function reject(err) {
      if (hiddenPromise.status === 'pending') {
        (function () {
          hiddenPromise.status = 'rejected';
          hiddenPromise.value = err;

          for (var i = 0, length = onReject.length; i < length; i++) {
            hiddenPromise.handled = true;

            onReject[i](err);
          }

          var onUnhandledRejection = Promise.onUnhandledRejection,
              onError = Promise.onError;


          if (isFunction(onError)) {
            onError(err);
          }

          setTimeout(function () {
            if (!hiddenPromise.handled && isFunction(onUnhandledRejection)) {
              onUnhandledRejection(err);
            }
          }, 1);
        })();
      }
    }

    function resolve(value) {
      if (hiddenPromise.status === 'pending') {
        if (value && isFunction(value.then)) {
          return value.then(function (value) {
            resolve(value);
          }, function (err) {
            reject(err);
          });
        }

        hiddenPromise.status = 'fulfilled';
        hiddenPromise.value = value;

        for (var i = 0, length = onFulfill.length; i < length; i++) {
          hiddenPromise.handled = true;

          onFulfill[i](value);
        }
      }
    }
  }

  /**
   * @method Promise.all
   * @param {(Array|Iterable).<Promise|*>} iterable - Iterable object (like array) of promises
   * or any values.
   * @returns {Promise} New instance of Promise.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
   */


  createClass(Promise, [{
    key: 'abort',
    value: function abort() {}

    /**
     * @method Promise#catch
     * @param {onRejected} onRejected - onRejected callback.
     * @returns {Promise} New instance of Promise.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
     */

  }, {
    key: 'catch',
    value: function _catch(onRejected) {
      return this.then(null, onRejected);
    }

    /**
     * @method Promise#finally
     * @public
     * @param {onFulfilledOrRejected} onFulfilledOrRejected - onFulfilledOrRejected callback.
     * @returns {Promise}
     * @description Method for catching both fulfilled and rejected promises.
     *
     * @example
     * spinner.show();
     * fetchData()
     *   .then((data) => {
     *     // do something with data
     *   })
     *   .catch((err) => {
     *     // handle error somehow
     *   })
     *   .finally(() => {
     *     spinner.hide();
     *   });
     */

  }, {
    key: 'finally',
    value: function _finally(onFulfilledOrRejected) {
      var isFunc = isFunction(onFulfilledOrRejected);

      return this.then(function (value) {
        return Promise.resolve(isFunc ? onFulfilledOrRejected() : 0).then(function () {
          return value;
        });
      }, function (err) {
        return Promise.resolve(isFunc ? onFulfilledOrRejected() : 0).then(function () {
          return Promise.reject(err);
        });
      });
    }

    /**
     * @method Promise#then
     * @param {onFulfilled} [onFulfilled] - onFulfilled callback.
     * @param {onRejected} [onRejected] - onRejected callback.
     * @returns {Promise} New instance of Promise.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
     */

  }, {
    key: 'then',
    value: function then(onFulfilled, onRejected) {
      var promise = this.$$;

      if (promise.status === 'pending') {
        return new Promise(function (resolve, reject) {
          promise.handle('reject', onRejected, resolve, reject, secret);
          promise.handle('resolve', onFulfilled, resolve, reject, secret);
        });
      }

      promise.handled = secret;

      var value = promise.value;


      var method = void 0;
      var handler = void 0;

      if (promise.status === 'fulfilled') {
        method = 'resolve';
        handler = onFulfilled;
      } else {
        method = 'reject';
        handler = onRejected;
      }

      if (!isFunction(handler)) {
        return Promise[method](value);
      }

      try {
        return Promise.resolve(handler(value));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }], [{
    key: 'all',
    value: function all(iterable) {
      var array = [];

      var toResolve = 0;

      if (iterable[iterator]) {
        iterable = iterable[iterator]();

        return new Promise(function (resolve, reject) {
          var next = void 0;
          var i = 0;

          var _loop = function _loop() {
            var promise = Promise.resolve(next.value);

            toResolve++;

            (function (i) {
              promise.then(function (value) {
                toResolve--;
                array[i] = value;

                setTimeout(function () {
                  if (next.done && !toResolve) {
                    resolve(array);
                  }
                }, 1);
              }, reject);
            })(i++);
          };

          while (!(next = iterable.next()).done) {
            _loop();
          }

          if (!i) {
            return Promise.resolve([]);
          }
        });
      }

      var length = iterable.length;

      if (!length) {
        return Promise.resolve([]);
      }

      toResolve = length;

      return new Promise(function (resolve, reject) {
        var _loop2 = function _loop2(i) {
          var promise = Promise.resolve(iterable[i]);

          promise.then(function (value) {
            toResolve--;
            array[i] = value;

            if (!toResolve) {
              resolve(array);
            }
          }, reject);
        };

        for (var i = 0; i < length; i++) {
          _loop2(i);
        }
      });
    }

    /**
     * @method Promise.race
     * @param {(Array|Iterable).<Promise|*>} iterable - Iterable object (like array) of promises
     * or any values.
     * @returns {Promise} New instance of Promise.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race
     */

  }, {
    key: 'race',
    value: function race(iterable) {
      if (iterable[iterator]) {
        iterable = iterable[iterator]();

        return new Promise(function (resolve, reject) {
          var next = void 0;

          while (!(next = iterable.next()).done) {
            next.value.then(resolve, reject);
          }
        });
      }

      return new Promise(function (resolve, reject) {
        for (var i = 0, length = iterable.length; i < length; i++) {
          iterable[i].then(resolve, reject);
        }
      });
    }

    /**
     * @method Promise.reject
     * @param {*} [value] - Value to reject.
     * @returns {Promise} New instance of Promise.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject
     */

  }, {
    key: 'reject',
    value: function reject(value) {
      return new Promise(function (resolve, reject) {
        reject(value);
      });
    }

    /**
     * @method Promise.resolve
     * @param {Promise|Thenable|*} [value] - Promise, thenable or any value to resolve.
     * @returns {Promise} New instance of Promise.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
     */

  }, {
    key: 'resolve',
    value: function resolve(value) {
      if (value && isFunction(value.then)) {
        return value;
      }

      return new Promise(function (resolve) {
        resolve(value);
      });
    }
  }]);
  return Promise;
}();

Promise$1.onError = null;
Promise$1.onUnhandledRejection = console.error.bind(console, '%s %o', 'Uncaught (in promise)');

module.exports = Promise$1;
