'use strict';

const kue = require('kue');

const queue = kue.createQueue({
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

module.exports = queue;
