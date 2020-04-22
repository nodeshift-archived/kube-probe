'use strict';

const test = require('tape');
const supertest = require('supertest');

const connect = require('connect');
const probe = require('..');

test('test defaults for readiness', async t => {
  const app = connect();
  probe(app);

  const response = await supertest(app).get('/api/health/readiness').expect(200);

  t.equal(response.text, 'OK', 'should just return OK for the text');
  t.end();
});

test('test defaults for liveness', async t => {
  const app = connect();
  probe(app);

  const response = await supertest(app).get('/api/health/liveness').expect(200);

  t.equal(response.text, 'OK', 'should just return OK for the text');
  t.end();
});

test('test different url and callback for readiness', async t => {
  const app = connect();
  const options = {
    readinessURL: '/different/api/ready',
    readinessCallback: (request, response) => {
      return response.end('Different Callback');
    }
  };

  probe(app, options);

  const response = await supertest(app).get('/different/api/ready').expect(200);

  t.equal(response.text, 'Different Callback', 'Different Callback shold be the new text');
  t.end();
});

test('test different url and callback for liveness', async t => {
  const app = connect();
  const options = {
    livenessURL: '/different/api/ready',
    livenessCallback: (request, response) => {
      return response.end('Different Callback');
    }
  };

  probe(app, options);

  const response = await supertest(app).get('/different/api/ready').expect(200);

  t.equal(response.text, 'Different Callback', 'Different Callback should be the new text');
  t.end();
});

test('default content type for readiness endpoint', async t => {
  t.plan(1);
  const app = connect();
  probe(app);

  const response = await supertest(app)
    .get('/api/health/readiness')
    .expect(200)
    .expect('Content-Type', /text\/html/);

  t.strictEqual(response.text, 'OK', 'expected response');
  t.end();
});

test('default content type for liveness endpoint', async t => {
  t.plan(1);
  const app = connect();
  probe(app);

  const response = await supertest(app)
    .get('/api/health/liveness')
    .expect(200)
    .expect('Content-Type', /text\/html/);

  t.strictEqual(response.text, 'OK', 'expected response');
  t.end();
});

test('custom content type for liveness endpoint', async t => {
  t.plan(1);
  const app = connect();
  probe(app, {
    livenessCallback: (request, response) => {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({status: 'OK'}));
    }
  });

  const response = await supertest(app)
    .get('/api/health/liveness')
    .expect(200)
    .expect('Content-Type', /json/);

  t.strictEqual(response.body.status, 'OK', 'expected response');
  t.end();
});

test('bypass kube-probe protection', async t => {
  t.plan(2);
  const app = connect();

  probe(app, {
    bypassProtection: true,
  });

  const readinessResponse = await supertest(app)
    .get('/api/health/readiness')
    .expect(200)
    .expect('Content-Type', /text\/html/);

    const livenessResponse = await supertest(app)
    .get('/api/health/liveness')
    .expect(200)
    .expect('Content-Type', /text\/html/);

    t.strictEqual(readinessResponse.text, 'OK', 'Expected readiness response');
    t.strictEqual(livenessResponse.text, 'OK', 'Expected liveness response');
    t.end()
});
