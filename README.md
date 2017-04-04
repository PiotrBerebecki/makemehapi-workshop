## Make Me Hapi

**makemehapi** is a workshop that will run you through a series of challenges ranging from a basic "hello world" server to more advanced exercises dealing with rendering views and helpers functions.

The official workshop lives in this [GitHub repo](https://github.com/hapijs/makemehapi). It's a great workshop but the instructions for some exercises can be a little confusing. To help you out, we've written the guidelines below, and rephrased the exercise instructions.

To get set up:  
1) Install makemehapi globally by running `npm install -g makemehapi`  
2) Create a folder on your computer, e.g. `makemehapi-workshop` and `cd` into it  
3) Run `npm init` to initialise a `package.json`, and install `hapi`. You will use this one and only `package.json` to install additional plugins as specified in the exercises.

For each exercise:  
1) Create a new subfolder, e.g. `exercise-1` and `cd` into it  
2) Follow the instructions below for that exercise  
3) To test your code:  
~ run `makemehapi` in the Terminal  
~ select the relevant exercise from the displayed list  
~ run `makemehapi verify path-to-file` (e.g. `makemehapi verify server.js`, provided you are already in `exercise-1` subfolder)  

_Note: The instructions below are a modified version of those you will see in your Terminal. Please use these to avoid confusion._

### HELLO HAPI
Exercise 1

Create a hapi server that listens on a port passed from the command line and
replies with "Hello hapi" when an HTTP GET request is sent to the path `/`.

#### HINTS

Create a server that listens to the port passed from the command
line, or defaults to 8080, using the following code:

```js
var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: Number(process.argv[2] || 8080)
});
```

Routes are added using the `route` function:

```js
server.route({
    path: '/',
    method:'GET',
    handler: anonOrYourFunction
});
```

Handlers can be anonymous functions or separately declared (just like in
javascript :P), but all of them should have this signature:

```js
function handler(request, reply) {

    // Request has all information
    // Reply handles client response

    reply();
}
```

Calling the `start` function gets a server listening on the assigned port. Note
that a callback is required when calling `start`, for example:

```js
server.start(function () {
    console.log('Server running at:', server.info.uri);
});
```

### ROUTES
Exercise 2

Create a hapi server that listens on a port passed from the command line and
outputs "Hello [name]", where [name] is obtained from the URL of the GET request (i.e. request to the path `/{name}`).

#### HINTS

Create a server that listens to the port passed from the command
line, or defaults to `8080`, using the same code as in Exercise 1.

```js
var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: Number(process.argv[2] || 8080)
});
```

Add a route handler similar to the following:

```js
function handler (request, reply) {
    reply('Hello ' + request.params.name);
}
```

### HANDLING
Exercise 3

Create a server which responds to requests to the path `/` with a static HTML file named
`index.html` containing the following:

```html
<html>
    <head><title>Hello Handling</title></head>
    <body>
        Hello Handling
    </body>
</html>
```

#### HINTS

This exercise requires you to install the `inert` module, which is a hapi plugin
for serving static files and directories. You'll need to register the plugin in
your code in order to serve static files:

```js
var Inert = require('inert');

server.register(Inert, function (err) {
    if (err) throw err;
});
```

You can declare handlers as objects instead of functions. The object must
contain one of the following: `file` (requires `inert` plugin), `directory`
(requires `inert` plugin), `proxy` (requires `h2o2` plugin), or `view` (requires
`vision` plugin).

For example, `handler` can be assigned an object with the `file` property:

```js
handler: {
    file: "index.html"
}
```

Be careful: in practice, you'll need to provide an absolute path to an
`index.html` file in your program's directory. To achieve this, you'll probably
need the core Node module `path`, its `join()` method, and the global
variable `__dirname`.

### DIRECTORIES
Exercise 4

Create a server which routes requests to the path `/foo/bar/baz/file.html` to a
file in a directory, e.g. `public/file.html`. The file should contain the following content:

```html
<html>
    <head><title>Hello Directories</title></head>
    <body>
        Hello Directories
    </body>
</html>
```

#### HINTS

As before, you'll need to `require` and `register` the `inert` plugin to serve the static directory's
contents.

Handlers can be declared as an object with a `directory` property, which is itself an object containing the directory `path`.

```js
handler: {
    directory: {
      path: './public'
    }
}
```

Routes using the directory handler must include a path parameter at the end of
the path string. The path defined for the route does not need to correspond to
the file system directory structure, and the parameter name does not matter.

```js
path: "/path/to/somewhere/{param}"
```

Note the hint from the previous exercise about using `path`, `join()` and `__dirname`.

### VIEWS
Exercise 5

Create a server which responds to requests to `/?name=Handling` using a template
located at `templates/index.html`. The server should respond with the following HTML:

```html
<html>
    <head><title>Hello Handling</title></head>
    <body>
        Hello Handling
    </body>
</html>
```

#### HINTS

The following flow may help you conceptualise the problem:  
1) The server receives some information from the request, and stores that information. For example, query
parameters that are passed in via a URL are made available in the `query` object.  
2) The information is used to generate the response. In our example, the query parameters are used to fill in the template and produce the final HTML document.

This exercise requires you to install the `vision` module, which is a hapi plugin
for rendering templates. You'll need to register the plugin in your code in
order to render your templates:

```js
var Vision = require('vision');

server.register(Vision, function (err) {
    if (err) throw err;
});
```

`server.views()` is the server method that we use to configure the templates
used on our server. This method receives a configuration object in which we can
set different templating engines based on file extension (e.g. `html`). This object can also set a
directory path for your templates.

```js
server.views({
    engines: {
        html: require('handlebars')
    },
    path: Path.join(__dirname, 'templates')
});
```

To specify the template that will be used to generate the
response, you need to add the `view` property to the handler:

```js
handler: {
    view: "index.html"
}
```

In this exercise, we'll be using Handlebars. To install Handlebars:

```sh
npm install handlebars
```

With Handlebars templates, you can render a variable directly in HTML by
surrounding the variable with curly braces, e.g. `{{foo}}`.

Note: Query params get
automatically parsed and aren't declared in the route `path`. They can be accessed as follows:

```html
<div>{{query.paramName}}</div>
```

### PROXIES
Exercise 6

A proxy lets you relay requests from one server/service to another.

Create a server which listens on a port passed from the command line, takes any
requests to the path `/proxy` and proxies them to `http://localhost:65535/proxy`.

See the [wiki article](en.wikipedia.org/wiki/Proxy_server) for more information.

#### HINTS

This exercise requires you to install the `h2o2` module, which is a hapi plugin
for handling proxies. You'll need to register the plugin in your code in
order to use the `proxy` configuration:

```js
var H2o2 = require('h2o2');

server.register(H2o2, function (err) {
    if (err) throw err;
});
```

The `proxy` property can be used to generate a reverse proxy handler.

```js
handler: {
    proxy: {
        host: '127.0.0.1',
        port: 65535
    }
}
```

### HELPING
Exercise 7

Create a server which responds to requests to `/?name=Helping&suffix=!` using
the template from the VIEWS exercise.

This time, instead of placing the query parameter directly in the template, use a helper. Helpers are functions used within templates to manipulate the data passed to the template and/or other inputs.

Create a helper at `helpers/helper.js` and use it in the template to output the `name`
query parameter. The final HTML file should be as follows:

```html
<html>
    <head><title>Hello Helping!</title></head>
    <body>
        Hello Helping!
    </body>
</html>
```

The helper should concatenate the `name` and `suffix` query parameters.

#### HINTS

You can define a helpers path in the server options. All `.js` files in this
directory will be loaded and the file name will be used as the helper name.

```js
var options = {
    views: {
        ...
        helpersPath: 'helpers'
    }
};
```

Each file must export a single method with the signature `function(context)` and
return a string. The query parameters can be accessed from the object `context.data.root.query`.

``` javascript
module.exports = function(context) {
    return context.data.root.query.foo;
}
```

The helper function can then be used in the template by specifying its name:

```html
<div>{{helper}}</div>

```

Be sure to register the `vision` plugin when attempting to render the template.

### STREAMS
Exercise 8  

Create a hapi server which responds to `GET` requests to the path `/` by streaming a
transformed version of a given file. The transform you should use is ROT13, which is a simple letter substitution cipher that replaces a letter with the letter 13 letters after it in the alphabet.

See the [wiki article](https://en.wikipedia.org/wiki/ROT13) for more information.

Your input file should contain:

```
The Pursuit of Hapi-ness
```

And the output should be:

```
Gur Chefhvg bs Uncv-arff
```

#### HINTS

**Streams**

The hapi handler `reply` function can accept a stream as an argument.

**File**

The `fs` module has a `createReadStream(pathToFile)` function that would be useful.

**Simple ROT13**

In this exercise, we'll be using `rot13-transform`. To install rot13-transform:

``` sh
npm install rot13-transform
```

### VALIDATION
Exercise 9

Route configuration offers lots of ways to customize each endpoint offered by
your hapi application. One of those ways is through validation.

Validation can happen in parameters in the path, in inbound payload validation,
and outbound response. Objects for validation are defined in the `Joi`
validation framework.

Create a server that has a route configuration exposing an endpoint for
chickens. Specifically:

```
/chickens
```

Within the route, add a path parameter named `breed` which has an attached
validation within the route's configuration. The solution will just check that a
Validation object exists within the configuration for `breed`, not any specific
validation.

-----------------------------------------------------------------
##HINTS

Create a server that listens on port `8080` with the following code:

```js
var routeConfig = {
    path: '/a/path/{with}/{parameters}',
    method: 'GET',
    handler: myHandler,
    config: {
        validate: {
            params: {
                with: Joi.string().required(),
                parameters: Joi.string().required()
            }
        }
    }
}
```

All route information can be found here:

    {rootdir:/node_modules/hapi/API.md}

Joi

Information can be found here:

    {rootdir:/node_modules/joi/README.md}

To install joi:

```sh
npm install joi
```

### VALIDATION USING JOI OBJECT
Exercise 10

By using a `Joi` object we can specify highly customizable validation rules in
paths, request payloads, and responses.

Create a server exposing a login endpoint and reply with "login successful" when
an HTTP `POST` request is sent to `/login`.

The endpoint will accept following payload variables:

```isGuest```       (boolean)
```username```      (string)
```accessToken```   (alphanumeric)
```password```      (alphanumeric)

Validation should consist of following conditions:

i)   if ```isGuest``` is false, a ```username``` is required.
ii)  ```password``` cannot appear together with ```accessToken```.
iii) if any other parameters than specified above are sent, they should pass the validation.

If the validation is successful, the handler must return a text of `login successful`

-----------------------------------------------------------------
##HINTS

Create a server that listens on port `8080` with the following code:

```js

var routeConfig = {
    path: '/a/path/',
    method: 'POST',
    handler: myHandler,
    config: {
        validate: {
           payload: Joi.object({
                username: Joi.string(),
                password: Joi.string().alphanum(),
                accessToken: Joi.string().alphanum(),
                birthyear: Joi.number().integer().min(1900).max(2013),
                email: Joi.string().email()
           })
           .options({allowUnknown: true})
           .with('username', 'birthyear')
           .without('password', 'accessToken')
        }
    }
}
```

All route information can be found here:

    {rootdir:/node_modules/hapi/API.md}

Joi information can be found here:

    {rootdir:/node_modules/joi/README.md}

### UPLOADS
Exercise 11

Create a server with an endpoint that accepts an uploaded file to the following
path:

```
/upload
```

The endpoint should accept the following keys: description and file. The
```description``` field should be a string describing whatever you want, and
```file``` should be an uploaded file. The endpoint should return a JSON object
that follows the following pattern:

```json
{
  description :  //description from form
  file : {
    data :    //content of file uploaded
    filename:  //name of file uploaded
    headers :   //file header provided by hapi
  }
}
```

-----------------------------------------------------------------
##HINTS

To accept a file as input, your request should use the ```multipart/form-data```
header.

We can get a file as readable stream by adding the following in the route
configuration:

```js

payload: {
    output : 'stream',
    parse : true
}
```

If we've uploaded the file with the parameter ```file```, then we can access it
in the handler function using following code:

```js
handler: function (request, reply) {
    var body = '';
    request.payload.file.on('data', function (data){

      body += data
    });

    request.payload.file.on('end', function (){

      console.log(body);
    });
}
```

More information about file uploading can be found in the reply interface of the
hapi [API docs](http://hapijs.com/api#reply-interface).


### COOKIES
Exercise 12

Create a server that has a route configuration exposing an endpoint ``set-
cookie`` and ``check-cookie`` which can be accessed using a `'GET'` request.
Specifically:

```
/set-cookie
```

The `set-cookie` endpoint will set a cookie with the key 'session' and the value
`{ key: 'makemehapi' }`. The cookie should be `base64json` encoded, should
expire in `10 ms`, and have a domain scope of `localhost`.  The response is
unimportant for this exercise, and may be anything you like.

```
/check-cookie
```

The `check-cookie` endpoint will have cookies received from the `/set-cookie`
endpoint. If the `session` key is present in cookies then simply return
`{ user: 'hapi' }`, otherwise return an `unauthorized` access error.

--------------------

##HINTS

In your `server.route()` function, you may add the following option:

```js
config: {
    state: {
        parse: true,
        failAction: 'log'
    }
}
```

By using this option, we can configure the server to handle cookies in various ways.

`hapi` provides a way to manage cookies for a specific url path.

```js
server.state('session', {
    path: '/',
});
```

We can set cookies while replying to request as follows:

```js
reply('success').state('session', 'session')
```

Cookie values are stored in server state, accessible using following code:

```js
var session = request.state.session;
```

More information about handling of cookies in `hapi` can be found in the Hapi
directory in `node_modules` here [API](http://hapijs.com/api).

While not required for this exercise, you may use [Boom](https://www.npmjs.com/package/boom)
to more easily return an `unauthorized` error along with the correct HTTP status
code:

```js
var Boom = require('boom');
```

```js
reply(Boom.unauthorized('Missing authentication'));
```

### AUTH
Exercise 13

Basic Authentication is a simple way to protect access to your application using
only a username and password. There is no need for cookies or sessions, only a
standard HTTP header.

Create a hapi server that listens on a port passed from the command line and is
protected with Basic Authentication. The authentication username should be
"hapi" and the password "auth" and the server should respond with an HTTP 401
status code when authentication fails.

--------------------

##HINTS

There is a hapi plugin for handling basic authentication. Install it by running:

```sh
npm install hapi-auth-basic
```

You'll need to register the `hapi-auth-basic` plugin then configure a named
authentication strategy for `basic`. Once authentication is configured, you'll
need to set the `auth` property in the route configuration to the name of the
strategy you configured.

```js
server.auth.strategy('simple', 'basic', { validateFunc: validate });

server.route({
    method: 'GET',
    path: '/',
    config: {
        auth: 'simple',
        handler: function (request, reply) {
            reply();
        }
    }
});
```

Hapi-auth-basic information can be found here:

    {rootdir:/node_modules/hapi-auth-basic/README.md}
