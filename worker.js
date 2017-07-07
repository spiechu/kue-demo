'use strict';

const debug = require('debug')('app:worker');

const kueHandler = require('./modules/kue-handler');

debug('Worker started');

kueHandler.watchStuckJobs();

kueHandler.consumeJob(function(err) {
  if (err) {
    debug('Failed job, reason: ' + err);

    return;
  }

  debug('Job successfully completed');
});
