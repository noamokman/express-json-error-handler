import {INTERNAL_SERVER_ERROR, BAD_REQUEST} from 'http-status';
import statuses from 'statuses';
import _ from 'lodash';

export default ({log} = {}) => (err, req, res, next) => { // eslint-disable-line no-unused-vars
  let status = err.status || err.statusCode || INTERNAL_SERVER_ERROR;

  if (status < BAD_REQUEST) {
    status = INTERNAL_SERVER_ERROR;
  }

  res.status(status);

  const body = {
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

  _.assign(body, _.pick(err, ['message', 'code', 'name', 'type']));

  res.json(body);
};
