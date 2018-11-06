[![Build Status](https://travis-ci.org/nodeshift/kube-probe.svg?branch=master)](https://travis-ci.org/nodeshift/kube-probe) [![Coverage Status](https://coveralls.io/repos/github/nodeshift/kube-probe/badge.svg?branch=master)](https://coveralls.io/github/nodeshift/kube-probe?branch=master)

Connect middleware that sets up generic liveness and readiness probes for OpenShift/Kubernetes

Example Usage:

    const express = require('express');
    const app = express();

    const probe = require('kube-probe');

    probe(app);


This will add 2 `GET` endpoints `/api/health/liveness` and `/api/health/readiness`
that will return a `200 OK` response. This module uses `overload-protection` to identify
when a process may be overloaded, and will return `HTTP 503 Service Unavailable`
if the service becomes too heavily loaded. Configuration of the `protection-config` module
may be passed as `options.protectionConfig`.

See: https://github.com/davidmarkclements/overload-protection/

#### Parameters

[![Greenkeeper badge](https://badges.greenkeeper.io/nodeshift/kube-probe.svg)](https://greenkeeper.io/)

* app - an instance of a connect-based framework (e.g. express.js) - required

* options - optional
* options.readinessURL - string - url where the readiness probe is located
* options.livenessURLURL - string - url where the livenessURL probe is located
* options.readinessCallback - function - function to call when the readiness probe is triggered
* options.livenessCallback - function - function to call when the liveness probe is triggered
* options.protectionConfig - object - options passed direction to `overload-protection`
