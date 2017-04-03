const hapi = require('hapi');
const h2o2 = require('h2o2');


const server = new hapi.Server();


server.connection({
  host: 'localhost',
  port: Number(process.argv[2] || 8080)
});


server.register(h2o2, err => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/proxy',
    handler: {
      proxy: {
        host: '127.0.0.1',
        port: 65535
      }
    }
  });
});


server.start(err => {
  if (err) {
    throw err;
  }
  console.log(`Running on ${server.info.uri}`);
});
