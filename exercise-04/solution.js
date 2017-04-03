const hapi = require('hapi');
const inert = require('inert');
const path = require('path');


const server = new hapi.Server();


server.connection({
  host: 'localhost',
  port: Number(process.argv[2] || 8080)
});


server.register(inert, err => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/foo/bar/baz/{filename*}',
    handler: {
      directory : {
        path: path.join(__dirname, 'public') // serve from server folder
        // path: 'public/' // server from root folder
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
