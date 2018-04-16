'use strict';

const test = require('tape');
const supertest = require('supertest');

const connect = require('connect');
const probe = require('..');

test('test defaults for readiness', t => {
  const app = connect();
  probe(app);

  supertest(app)
    .get('/api/health/readiness')
    .expect(200)
    .then(response => {
      t.equal(response.text, 'OK', 'should just return OK for the text');
      t.end();
    });
});

test('test defaults for liveness', t => {
  const app = connect();
  probe(app);

  supertest(app)
    .get('/api/health/liveness')
    .expect(200)
    .then(response => {
      t.equal(response.text, 'OK', 'should just return OK for the text');
      t.end();
    });
});

test('test different url and callback for readiness', t => {
  const app = connect();
  const options = {
    readinessURL: '/different/api/ready',
    readinessCallback: (request, response) => {
      return response.end('Different Callback');
    }
  };

  probe(app, options);

  supertest(app)
    .get('/different/api/ready')
    .expect(200)
    .then(response => {
      t.equal(response.text, 'Different Callback', 'Different Callback shold be the new text');
      t.end();
    });
});

test('test different url and callback for liveness', t => {
  const app = connect();
  const options = {
    livenessURL: '/different/api/ready',
    livenessCallback: (request, response) => {
      return response.end('Different Callback');
    }
  };

  probe(app, options);

  supertest(app)
    .get('/different/api/ready')
    .expect(200)
    .then(response => {
      t.equal(response.text, 'Different Callback', 'Different Callback shold be the new text');
      t.end();
    });
});

test('default content type for readiness endpoint', t => {
  t.plan(1);
  const app = connect();
  probe(app);
  supertest(app)
    .get('/api/health/readiness')
    .expect(200)
    .expect('Content-Type', /text\/html/)
    .then(response => {
      t.strictEqual(response.text, 'OK', 'expected response');
      t.end();
    });
});

test('default content type for liveness endpoint', t => {
  t.plan(1);
  const app = connect();
  probe(app);
  supertest(app)
    .get('/api/health/liveness')
    .expect(200)
    .expect('Content-Type', /text\/html/)
    .then(response => {
      t.strictEqual(response.text, 'OK', 'expected response');
      t.end();
    });
});

test('custom content type for liveness endpoint', t => {
  t.plan(1);
  const app = connect();
  probe(app, {
    livenessCallback: (request, response) => {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({status: 'OK'}));
    }
  });
  supertest(app)
    .get('/api/health/liveness')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(response => {
      t.strictEqual(response.body.status, 'OK', 'expected response');
      t.end();
    });
});
