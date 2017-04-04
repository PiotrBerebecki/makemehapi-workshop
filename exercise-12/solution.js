const hapi = require('hapi');
const boom = require('boom');

const server = new hapi.Server();


server.connection({
  host: 'localhost',
  port: Number(process.argv[2] || 8080)
});


server.state('session', {
  path: '/',
  encoding: 'base64json',
  ttl: 10,
  domain: 'localhost',
  isSameSite: false,
  isSecure: false,
  isHttpOnly: false
});

server.route({
  method: 'GET',
  path: '/set-cookie',
  handler: (request, reply) => {
    return reply('great success').state('session', { key : 'makemehapi' });
  },
  config: {
    state: {
      parse: true,
      failAction: 'log'
    }
  }
});

server.route({
  method: 'GET',
  path: '/check-cookie',
  handler: (request, reply) => {
    const  session = request.state.session;
    let result;

    if (session) {
      result = { user : 'hapi' };
    } else {
      result = boom.unauthorized('Missing authentication');
    }

    reply(result);
  }
});


server.start(err => {
  if (err) {
    throw err;
  }
  console.log(`Running on ${server.info.uri}`);
});
