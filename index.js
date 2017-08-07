'use strict';

const READINESS_URL = '/api/health/readiness';
const LIVENESS_URL = '/api/health/liveness';

function defaultResponse (request, response) {
  return response.send('OK');
}

/*
  @param {object} app - an instance of express
  @param {object} [options]
  @param {string} [options.readinessURL] - url where the readiness probe is located
  @param {string} [options.livenessURL] - url where the liveness probe is located
  @param {function} [options.readinessCallback] - function to call when the readiness probe is triggered
  @param {function} [options.livenessCallback] - function to call when the liveness probe is triggered
*/
module.exports = function (app, options = {}) {
  app.use(options.readinessURL || READINESS_URL, options.readinessCallback || defaultResponse);
  app.use(options.livenessURL || LIVENESS_URL, options.livenessCallback || defaultResponse);
};
