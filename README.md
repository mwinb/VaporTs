# DocTS

DocTs is a minimal framework built to support a simple and only slightly opinionated object oriented approach to implementing and unit testing Expressjs applications. DocTS is primarily focused on the use of two primary decorators. The Controller decorator, which provides a simple way to describe express controllers, their paths, and middleware, and the Route decorator, which provides simple HTTP method declaration, extension to the Controller path, individual middleware, and a prebuilt optional asynchronous http error response handler.

---

## Installation:

`npm i --save @mwinberry/doc-ts`

---

# Decorators

## Controller

### Parameters:

- Path: String (required)
- Middleware: Middleware[] (optional)

### Examples:

#### Without middleware:

```typescript
@Controller('/example')
class ExampleController {}
```

#### With Middleware:

```typescript
@Controller('/example', [controllerMiddleware])
class ExampleController {}
```

---

## Route

### Parameters:

- Method: string
  - 'POST' | 'PATCH' | 'PUT' | 'GET' | 'DELETE' | 'HEAD' | 'CONNECT' | 'OPTIONS' | 'TRACE'
- RouteParams: { } (optional)
  - path: string | string[] (optional)
  - middleware: Middleware[] (optional)
  - applyHttpError: boolean (optional, default: true)

### Examples:

```typescript
@Controller('/example')
class ExampleController {
  @Route('GET')
  async exampleGetFunction(req, res) {}

  @Route('GET', { path: '/:id', middleware: [routeMiddleware] })
  async exampleGetOneFunction(req, res) {}

  @Route('GET', { path: ['/pathone', '/pathtwo'] })
  async exampleGetWithTwoPaths(req, res) {}

  @Route('PATCH', { applyHttpError: false })
  examplePatchNoHttpError(req, res, next) {}
}
```

---

## HttpErrorHandler

The HttpErrorHandler is applied to all Routes by default, but can also be used as an individual decorator. This handler wraps asynchronous Route decorated functions in a try catch that listens for an HttpError to be thrown. The HttpError takes in the code and the response message. When caught by the handler, the express response status is set to the HttpErrors code and a json object with the code and message are sent. All uncaught errors respond with a 500 and an ambiguous error message.

### Example - response (caught):

```typescript
res.status(404).json({ code: 404, message: 'Not Found' });
```

### Example - response (uncaught):

```typescript
res.status(500).json({ code: 500, message: 'Oops something went wrong.' });
```

---

# Classes

## DocApp

The DocApp class is responsible for binding all routes, methods, and middleware to an express application. It is recommended that any DocApp classes (many can be initialized for version control purposes) be instantiated at entry point of the application. For

### Parameters:

- DocAppConfig: {}
  - path: string (optional, defaults to root)
  - showApi: boolean (optional, default: false)
    - This provides a simple html page @GET/path that lists all routes as links and their respective methods.
  - middleware: Middleware[] (optional)
    - Sets the path middleware.
  - controllers: Controller[] (required)
    - any class with the Controller Decorator will ignore any other classes in controller initialization.
  - expressApplication: Express.Application (required)
  - router: Express.Router (required)

### Example:

```typescript
// server.ts
const port = 5000;
const expressApp = express();
const appV1 = new DocApp({
  path: '/v1',
  showApi: true,
  middleware: [pathMiddleware],
  controllers: [new SatelliteController()],
  expressApplication: expressApp,
  router: express.Router()
});

expressApp.listen(port, () => {
  console.log(`App listening on the port ${port}`);
  if (appV1.showApi) console.log(`View v1: http://localhost:${port}${appV1.path}`);
});
```

---

## HttpError

Extends the Error class and is caught with the HttpErrorHandler decorator or by default in Route decorated async functions. HttpErrorHandler can be disabled by setting the applyHttpError parameter in Route to false.

### Parameters:

- code: number (required)
- message: string (required)

### Example:

```typescript
throw new HttpError(404, 'Not Found');
```

### Example application @ https://github.com/mwinb/DocTS/tree/main/example

#### Created By Michael Winberry
