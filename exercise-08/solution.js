const hapi = require('hapi');
const path = require('path');
const fs = require('fs');
const rot13 = require('rot13-transform');


const server = new hapi.Server();


server.connection({
  host: 'localhost',
  port: Number(process.argv[2] || 8080)
});


server.route({
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    const readStream = fs.createReadStream(path.join(__dirname, 'input.txt'), 'utf8');

    readStream.on('error', () => {
      reply('Cannot create read stream');
      return;
    });

    readStream.on('open', () => {
      reply(readStream.pipe(rot13()));
    });
  }
});


server.start(err => {
  if (err) {
    throw err;
  }
  console.log(`Running on ${server.info.uri}`);
});
