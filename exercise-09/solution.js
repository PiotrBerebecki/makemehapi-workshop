const hapi = require('hapi');
const joi = require('joi');

const server = new hapi.Server();


server.connection({
  host: 'localhost',
  port: Number(process.argv[2] || 8080)
});


server.route({
  method: 'GET',
  path: '/chickens/{breed}',
  config: {
    handler: (request, reply) => {
      reply(`You asked for the chicken ${encodeURIComponent(request.params.breed)}`);
    },
    validate: {
      params: {
        breed: joi.string().required()
      }
    }
  }
});


server.start(err => {
  if (err) {
    throw err;
  }
  console.log(`Running on ${server.info.uri}`);
});
