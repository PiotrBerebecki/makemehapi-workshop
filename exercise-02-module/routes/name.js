module.exports = {
  method: 'GET',
  path: '/{name}',
  handler: (request, reply) => {
    reply(`Hello ${encodeURIComponent(request.params.name)}`);
  }
};
