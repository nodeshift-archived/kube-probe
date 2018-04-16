'use strict';

const protection = require('overload-protection');

const READINESS_URL = '/api/health/readiness';
const LIVENESS_URL = '/api/health/liveness';

function defaultResponse (request, response) {
  response.setHeader('Content-Type', 'text/html');
  return response.end('OK');
}

/*
  @param {object} app - an instance of a connect.js web framework
  @param {object} [options]
  @param {string} [options.readinessURL] - url where the readiness probe is located
  @param {string} [options.livenessURL] - url where the liveness probe is located
  @param {function} [options.readinessCallback] - function to call when the readiness probe is triggered
  @param {function} [options.livenessCallback] - function to call when the liveness probe is triggered
  @param {object} [options.protectionConfig] - options passed directly to 'overload-protection' module
*/
module.exports = function (app, options = {}) {
  const protectCfg = Object.assign({
    production: process.env.NODE_ENV === 'production',
    maxHeapUsedBytes: 0, // Maximum heap used threshold (0 to disable) [default 0]
    maxRssBytes: 0 // Maximum rss size threshold (0 to disable) [default 0]
  }, options.protectionConfig);
  const readiness = options.readinessURL || READINESS_URL;
  const liveness = options.livenessURL || LIVENESS_URL;
  const protect = protection('http', protectCfg);

  app.use(readiness, protect);
  app.use(readiness, options.readinessCallback || defaultResponse);
  app.use(liveness, options.livenessCallback || defaultResponse);
  app.use(liveness, protect);
};
