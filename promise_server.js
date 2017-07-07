'use strict';

const express = require('express');
const app = express();
const debug = require('debug')('app:server');
const kue = require('kue');
const Promise = require('promise');

const kueHandler = require('./modules/kue-handler');

let createJobPromise = function(title) {
  return new Promise(function(resolve, reject) {
    kueHandler.addJob(title, function(err, job) {
      if (err) {
        return reject(err);
      }

      job.on('complete', function(result) {
        resolve(result);
      });

      job.on('failed', function(err) {
        reject(err);
      });
    });
  });
};

app.get('/', function(req, res) {
  res.send('I\'m Kue app created within 2 hours');
});

app.get('/add/:title', function(req, res) {
  debug('/add/' + req.params.title + ' endpoint hit');

  let jobPromises = [
    createJobPromise(req.params.title),
    createJobPromise(req.params.title + '/bitcoin'),
    createJobPromise(req.params.title + '/db'),
  ];

  Promise
      .all(jobPromises)
      .then(function(results) {
        res.send('Job results: <br>' + results.join('<br>'));
      })
      .catch(function(reason) {
        res.send('Job failed, reason: ' + reason);
      });
});

app.listen(3456, function() {
  debug('Express server listening on port 3456');
});
