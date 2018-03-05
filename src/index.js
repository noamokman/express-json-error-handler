import httpStatus from 'http-status';
import statuses from 'statuses';
import _ from 'lodash';

const inProduction = process.env.NODE_ENV === 'production';
export default function ({log} = {}) {
  return (err, req, res, next) => { // eslint-disable-line no-unused-vars
    let status = err.status || err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

    if (status < httpStatus.BAD_REQUEST) {
      status = httpStatus.INTERNAL_SERVER_ERROR;
    }

    res.status(status);

    const body = {
      status
    };

    if (!inProduction) {
      body.stack = err.stack;
    }

    if (status >= httpStatus.INTERNAL_SERVER_ERROR) {
      body.message = statuses[status];

      if (log) {
        log({err, req, res});
      }
      res.json(body);

      return;
    }

    _.assign(body, _.pick(err, ['message', 'code', 'name', 'type']));

    res.json(body);
  };
}
