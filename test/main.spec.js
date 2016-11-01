import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import mockery from 'mockery';
import jsonErrorHandler from '../src';

chai.use(sinonChai);

const {expect} = chai;

describe('express-json-error-handler', () => {
  describe('exports', () => {
    it('should expose a default function', () => {
      expect(jsonErrorHandler).to.be.a('function');
    });
  });

  describe('usage', () => {
    it('should return an error handler', () => {
      expect(jsonErrorHandler()).to.be.a('function');
    });
  });

  describe('error handler', () => {
    it('should handle an unknown error', () => {
      const errorHandler = jsonErrorHandler();

      const res = {
        json: sinon.stub(),
        status: sinon.stub()
      };

      const err = new Error('error');

      errorHandler(err, null, res);

      expect(res.status).to.have.been.calledWith(500);
    });

    it('should handle an invalid status', () => {
      const errorHandler = jsonErrorHandler();

      const res = {
        json: sinon.stub(),
        status: sinon.stub()
      };

      const err = new Error('error');

      err.statusCode = 214;

      errorHandler(err, null, res);

      expect(res.status).to.have.been.calledWith(500);
    });

    it('should handle client errors', () => {
      const errorHandler = jsonErrorHandler();

      const res = {
        json: sinon.stub(),
        status: sinon.stub()
      };

      const err = new Error('error');

      err.statusCode = 400;

      errorHandler(err, null, res);

      expect(res.status).to.have.been.calledWith(400);
      const clientErr = res.json.getCall(0).args[0];

      expect(clientErr).to.have.property('status')
        .and.equal(400);
      expect(clientErr).to.have.property('name')
        .and.equal('Error');
      expect(clientErr).to.have.property('message')
        .and.equal('error');
      expect(clientErr).to.have.property('stack');
    });

    it('should handle a log method', () => {
      const log = sinon.stub();

      const errorHandler = jsonErrorHandler({log});

      const res = {
        json: sinon.stub(),
        status: sinon.stub()
      };

      const err = new Error('error');

      errorHandler(err, null, res);

      expect(log).to.have.been.calledWith({res, req: null, err});
    });

    it('should ignore stack on production', function () {
      this.timeout(5000);

      mockery.registerMock('in-production', true);

      mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
      });

      const jsonErrorHandler = require('../src').default;

      const errorHandler = jsonErrorHandler();

      const res = {
        json: sinon.stub(),
        status: sinon.stub()
      };

      const err = new Error('error');

      err.statusCode = 400;

      errorHandler(err, null, res);

      expect(res.status).to.have.been.calledWith(400);
      const clientErr = res.json.getCall(0).args[0];

      expect(clientErr).to.have.property('status')
        .and.equal(400);
      expect(clientErr).to.have.property('name')
        .and.equal('Error');
      expect(clientErr).to.have.property('message')
        .and.equal('error');
      expect(clientErr).to.not.have.property('stack');

      mockery.disable();
    });
  });
});