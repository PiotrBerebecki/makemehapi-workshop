const hapi = require('hapi');
const vision = require('vision');
const path = require('path');


const server = new hapi.Server();


server.connection({
  host: 'localhost',
  port: Number(process.argv[2] || 8080)
});


server.register(vision, err => {
  if (err) {
    throw err;
  }

  server.views({
    engines: {
      html: require('handlebars')
    },
    path: path.join(__dirname, 'templates')
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: {
      view: 'index.html'
    }
  });

});


server.start(err => {
  if (err) {
    throw err;
  }
  console.log(`Running on ${server.info.uri}`);
});
