const hapi = require('hapi');
const auth = require('hapi-auth-basic');


const server = new hapi.Server();


const user = { name: 'hapi', password: 'auth' };


const validate = (request, username, password, callback) => {
  const isValid = username === user.name && password === user.password;

  return callback(null, isValid, { name: user.name });
};


server.connection({
  host: 'localhost',
  port: Number(process.argv[2] || 8080)
});


server.register(auth, (err) => {
  server.auth.strategy('simple', 'basic', { validateFunc: validate });
  server.route({
    method: 'GET',
    path: '/',
    config: {
      auth: 'simple',
      handler: (request, reply) => {
        reply();
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
