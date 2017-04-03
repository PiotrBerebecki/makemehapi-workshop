const hapi = require('hapi');
const inert = require('inert');
const path = require('path');


const server = new hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: __dirname
      }
    }
  }
});


server.connection({
  host: 'localhost',
  port: Number(process.argv[2] || 8080)
});


const landingRoute = {
  method: 'GET',
  path: '/',
  handler: {
    file: path.join(__dirname, 'index.html')
  }
};


server.register(inert, err => {
  if (err) {
    throw err;
  }
  server.route(landingRoute);
});


server.start(err => {
  if (err) {
    throw err;
  }
  console.log(`Server runnig on ${server.info.uri}`);
});
