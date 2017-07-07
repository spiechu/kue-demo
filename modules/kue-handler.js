'use strict';

const queue = require('./queue');
const debug = require('debug')('app:kue-handler');

const MY_JOB_TYPE = 'my-job-type';

module.exports = {
  addJob: function(title, callback) {
    debug('adding new Kue job');

    let job = queue.create(MY_JOB_TYPE, {
      title: title,
    });

    job.removeOnComplete(true).attempts(3).backoff({
      delay: 5 * 1000,
      type: 'fixed',
    }).save(function(err) {
      if (err) {
        debug('Something went wrong with job ' + job.id);
      }

      callback(err, job);
    });

    job.on('enqueue', function() {
      debug('Job ' + this.id + ' enqueued');
    });

    job.on('start', function() {
      debug('Type ' + this.type + ' started');
      debug('Title: ' + this.data.title);
    });

    job.on('complete', function(result) {
      debug('Type ' + this.type + ' completed');
      debug('Title: ' + this.data.title);
      debug('Result: ' + result);
    });

    job.on('failed attempt', function(err, doneAttempts) {
      debug('Type ' + this.type + ' attempt ' + doneAttempts + ' failed');
      debug('Title: ' + this.data.title);
      debug('Reason: ' + err);
    });

    job.on('failed', function(err) {
      debug('Type ' + this.type + ' failed');
      debug('Title: ' + this.data.title);
      debug('Reason: ' + err);
    });
  },
  consumeJob: function(callback) {
    debug('Started consuming Kue jobs');

    queue.process(MY_JOB_TYPE, function(job, done) {
      debug('processing ' + MY_JOB_TYPE + ', title: ' + job.data.title);

      setTimeout(function() {
        let result = 'im job result from ' + job.data.title;

        done(null, result);
        callback(null, result);
      }, 10 * 1000); // Timeout in secs
    });
  },
  watchStuckJobs: function() {
    queue.watchStuckJobs(1000);
  }
};
