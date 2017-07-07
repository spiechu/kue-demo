Lightning talks 07.07.2017 demo project
=======================================

Installation
------------

1. sudo apt-get install redis-server
2. npm install

Run
---

1. NODE_ENV=dev DEBUG=app:* nodejs worker.js
2. NODE_ENV=dev DEBUG=app:* nodejs server.js

Run with debugger
-----------------

1. Setup Node.js Remote Debug in WebStorm/PhpStorm host: 127.0.0.1, port: 5858
2. NODE_ENV=dev DEBUG=app:* nodejs --debug-brk server.js
