import {INTERNAL_SERVER_ERROR, BAD_REQUEST} from 'http-status';
import statuses from 'statuses';
import {assign, pick} from 'lodash';
import {ErrorRequestHandler} from 'express';

export interface ExpressJsonErrorHandlerOptions {
  log?: ({err, req, res}: { err: Error; req: Express.Request; res: Express.Response }) => void;
}

export interface ResponseBody {
  status: number;
  stack?: any;
  message?: string;
  code?: any;
  name?: any;
  type?: any;
}

export default ({log}: ExpressJsonErrorHandlerOptions = {}): ErrorRequestHandler => (err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
  let status: number = err.status || err.statusCode || INTERNAL_SERVER_ERROR;

  if (status < BAD_REQUEST) {
    status = INTERNAL_SERVER_ERROR;
  }

  res.status(status);

  const body: ResponseBody = {
    status
  };

  if (process.env.NODE_ENV !== 'production') {
    body.stack = err.stack;
  }

  if (status >= INTERNAL_SERVER_ERROR) {
    body.message = statuses[status];

    if (log) {
      log({err, req, res});
    }

    res.json(body);

    return;
  }

  assign(body, pick(err, ['message', 'code', 'name', 'type']));

  res.json(body);
};
