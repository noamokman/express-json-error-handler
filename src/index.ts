import { STATUS_CODES } from 'node:http';
import { assign, pick } from 'lodash-es';
import type { Response, Request, NextFunction } from 'express';

export interface ExpressJsonErrorHandlerOptions {
  log?: ({ err, req, res }: { err: Error; req: Request; res: Response }) => void;
  extraFields?: string[];
}

export type ErrorWithStatus = Error & { status?: number; statusCode?: number };

export interface ResponseBody {
  status: number;
  stack?: any;
  message?: string;
  code?: any;
  name?: any;
  type?: any;
}

export const expressJsonErrorHandler =
  ({ log, extraFields }: ExpressJsonErrorHandlerOptions = {}) =>
  (err: ErrorWithStatus, req: Request, res: Response, _: NextFunction) => {
    let status: number = err.status ?? err.statusCode ?? 500;

    if (status < 400) {
      status = 500;
    }

    res.status(status);

    const body: ResponseBody = {
      status,
    };

    if (process.env.NODE_ENV !== 'production') {
      body.stack = err.stack;
    }

    if (status >= 500) {
      body.message = STATUS_CODES[status];

      if (log) {
        log({ err, req, res });
      }

      res.json(body);

      return;
    }

    assign(body, pick(err, [...(extraFields ?? []), 'message', 'code', 'name', 'type']));

    res.json(body);
  };

export default expressJsonErrorHandler;
