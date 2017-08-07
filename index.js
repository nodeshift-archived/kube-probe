'use strict';

const READINESS_URL = '/api/health/readiness';
const LIVENESS_URL = '/api/health/liveness';

function defaultResponse (request, response) {
  return response.send('OK');
}

module.exports = function (app, options = {}) {
  app.use(options.readinessURL || READINESS_URL, options.readinessCallback || defaultResponse);
  app.use(options.livenessURL || LIVENESS_URL, options.livenessCallback || defaultResponse);
};
