# express-json-error-handler [![Build Status](https://travis-ci.org/noamokman/express-json-error-handler.svg?branch=master)](https://travis-ci.org/noamokman/express-json-error-handler) [![Coverage Status](https://coveralls.io/repos/github/noamokman/express-json-error-handler/badge.svg?branch=master)](https://coveralls.io/github/noamokman/express-json-error-handler?branch=master)

Error handler for express JSON APIs

## Install
``` bash
$ npm install express-json-error-handler
```

## Usage

### Example
``` js
import express from 'express';
import jsonErrorHandler from 'express-json-error-handler';

const app = express();

app.use(jsonErrorHandler());

```

## Options

The `jsonErrorHandler` function takes an option `options` object that may contain any of
the following keys:

### log

The `log` option, if supplied, is called as `log({err, req, res})` when server errors occur.
#### Example
``` js
import express from 'express';
import jsonErrorHandler from 'express-json-error-handler';

const app = express();

app.use(jsonErrorHandler({
  log({err, req, res}) {
    console.log(err); // The original error object
    console.log(req); // The request object
    console.log(res); // The response object
  }
}));

```

## License

[MIT](LICENSE)