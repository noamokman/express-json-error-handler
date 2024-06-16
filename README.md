# express-json-error-handler

Error handler for express JSON APIs

## Install
``` bash
$ npm install express-json-error-handler
```

## Usage

### Example
``` js
import express from 'express';
import {expressJsonErrorHandler} from 'express-json-error-handler';

const app = express();

app.use(expressJsonErrorHandler());

```

## Options

The `expressJsonErrorHandler` function takes an option `options` object that may contain any of
the following keys:

### log

The `log` option, if supplied, is called as `log({err, req, res})` when server errors occur.
#### Example
``` js
import express from 'express';
import {expressJsonErrorHandler} from 'express-json-error-handler';

const app = express();

app.use(expressJsonErrorHandler({
  log({err, req, res}) {
    console.log(err); // The original error object
    console.log(req); // The request object
    console.log(res); // The response object
  }
}));

```

## License

[MIT](LICENSE)
