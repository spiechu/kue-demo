'use strict';

const express = require('express');
const app = express();
const debug = require('debug')('app:server');
const kue = require('kue');

const kueHandler = require('./modules/kue-handler');

// Run app with
// NODE_ENV=dev DEBUG=app:* nodejs server.js
// NODE_ENV=dev DEBUG=app:* nodejs worker.js

// Curl requests with:
// curl 127.0.0.1:3456/add/title

app.get('/', function(req, res) {
  res.send('<h2>I\'m Express & Kue app created within 2 hours</h2>');
});

app.get('/add/:title', function(req, res) {
  debug('/add/' + req.params.title + ' endpoint hit');

  kueHandler.addJob(req.params.title, function(err, job) {
    if (err) {
      return res.send('Smutna buba sie popsula');
    }

    res.send('Job ' + job.data.title + ' registered');
  });
});

app.listen(3456, function() {
  debug('Express server listening on port 3456');
});

kue.app.listen(3457);
