const http = require('node:http');
const { createApp } = require('./app');
const env = require('./config/env');

const handler = createApp();
const server = http.createServer(handler);

server.listen(env.port, () => {
  console.log(`Backend listening on port ${env.port}`);
});
