const hapi = require('hapi');


const server = new hapi.Server();


server.connection({
  host: 'localhost',
  port: Number(process.argv[2] || 8080)
});


server.route({
  method: 'POST',
  path: '/upload',
  config: {
    handler: (request, reply) => {
      let body = '';

      request.payload.file.on('data', (data) => {
        body += data;
      });

      request.payload.file.on('end', () => {
        const result = {
          description: request.payload.description,
          file: {
            data: body,
            filename: request.payload.file.hapi.filename,
            headers: request.payload.file.hapi.headers
          }
        };

        reply(JSON.stringify(result));
      });
    },
    payload: {
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    }
  }

});


server.start(err => {
  if (err) {
    throw err;
  }
  console.log(`Running on ${server.info.uri}`);
});
