import jsonErrorHandler from '../src';

describe('express-json-error-handler', () => {
  describe('exports', () => {
    it('should expose a default function', () => {
      expect(typeof jsonErrorHandler).toBe('function');
    });
  });

  describe('usage', () => {
    it('should return an error handler', () => {
      expect(typeof jsonErrorHandler()).toBe('function');
    });
  });

  describe('error handler', () => {
    it('should handle an unknown error', () => {
      const errorHandler = jsonErrorHandler();

      const res = {
        json: jest.fn(),
        status: jest.fn()
      };

      const err = new Error('error');

      errorHandler(err, null as any, res as any, null as any);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should handle an invalid status', () => {
      const errorHandler = jsonErrorHandler();

      const res = {
        json: jest.fn(),
        status: jest.fn()
      };

      const err: Error & { statusCode?: number } = new Error('error');

      err.statusCode = 214;

      errorHandler(err, null as any, res as any, null as any);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should handle client errors', () => {
      const errorHandler = jsonErrorHandler();

      const res = {
        json: jest.fn(),
        status: jest.fn()
      };

      const err: Error & { statusCode?: number } = new Error('error');

      err.statusCode = 400;

      errorHandler(err, null as any, res as any, null as any);

      expect(res.status).toHaveBeenCalledWith(400);
      const [[clientErr]] = res.json.mock.calls;

      expect(clientErr).toHaveProperty('status', 400);
      expect(clientErr).toHaveProperty('name', 'Error');
      expect(clientErr).toHaveProperty('message', 'error');
      expect(clientErr).toHaveProperty('stack');
    });

    it('should handle a log method', () => {
      const log = jest.fn();

      const errorHandler = jsonErrorHandler({log});

      const res = {
        json: jest.fn(),
        status: jest.fn()
      };

      const err: Error & { statusCode?: number } = new Error('error');

      errorHandler(err, null as any, res as any, null as any);

      expect(log).toHaveBeenCalledWith({res, req: null, err});
    });

    it('should ignore stack on production', () => {
      process.env.NODE_ENV = 'production';

      jest.resetModules();

      const jsonErrorHandler = require('../src').default;

      const errorHandler = jsonErrorHandler();

      const res = {
        json: jest.fn(),
        status: jest.fn()
      };

      const err: Error & { statusCode?: number } = new Error('error');

      err.statusCode = 400;

      errorHandler(err, null, res);

      expect(res.status).toHaveBeenCalledWith(400);
      const [[clientErr]] = res.json.mock.calls;

      expect(clientErr).toHaveProperty('status', 400);
      expect(clientErr).toHaveProperty('name', 'Error');
      expect(clientErr).toHaveProperty('message', 'error');
      expect(clientErr).not.toHaveProperty('stack');
    });
  });
});