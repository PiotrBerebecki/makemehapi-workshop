const hapi = require('hapi');
const routes = require('./routes');


const server = new hapi.Server();


server.connection({
  host: 'localhost',
  port: Number(process.argv[2] || 8080)
});


server.route(routes);


module.exports = server;
