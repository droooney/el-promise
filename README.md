# El Promise

Simple Promise library that follows [Promises/A+ specification](https://promisesaplus.com/).

## Installation

You can install el-promise using npm.

```bash
$ npm install --save el-promise
```

You have to use a module bundler
like [Webpack](http://webpack.github.io/ "Webpack")
or [Browserify](http://browserify.org/ "Browserify") or
 you can insert a script tag in you html like this:
 
```html
<script src="/node_modules/el-promise/build/promise.min.js"></script>
```

that defines global Promise variable (if needed).

## Usage

The library follows the specs 100% except that there is also
 a Promise#finally method:
 
```js
spinner.show();
  
fetchData()
  .then((data) => {
    // do something with data
  })
  .catch((err) => {
    // handle error somehow
  })
  .finally(() => {
    // here you have no arguments
    spinner.hide();
    // the value or the error from the previous promises stands
  });
```

The method takes a function as an argument that takes 0 arguments.
If the function throws an error or returns a rejected promise
 the returned promise will be rejected with the error.
Otherwise the function returns a promise resolved with the previous
 resolved value or rejected with the previous rejected error.
Also if the function returns a promise it will be first resolved
 but the resulting promise will be resolved with the previous value.

And there is also an abstract Promise#abort method
 (that may be used by other libraries or you).
