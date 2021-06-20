# VaporTs

## Description:

An experimental extension of DocTs that aims to create an event driven express and typescript based framework that allows for loosely coupled and easy to test servers.

## Installation:

`npm i --save vaporjs`

---

### Example application

- https://github.com/mwinb/vaporjs/tree/main/example

---

# Decorators

### [Supported DocTs Decorators](https://github.com/mwinb/DocTS/wiki/Decorators)

- @Controller
- @Route
- @Validate

---

# Classes

### [Supported DocTs Classes](https://github.com/mwinb/DocTS/wiki/Classes)

- HttpError

## VaporApp

The VaporApp class is responsible for binding all routes, methods, and middleware to an express application.

### Parameters:

- `VaporAppConfig: {}`
  - `path: string` (optional, defaults to root)
  - `showApi: boolean` (optional, default: false)
    - This provides a simple html page @GET/path that lists all routes as links and their respective methods.
  - `middleware: Middleware[]` (optional)
    - Sets the path middleware.
  - `logger: LoggerFn` (optional, default: console.log)
    - Allows user to redirect with a custom logger function.
    - `type LoggerFn = (message: any, ...additionalParams: any[]) => void | Promise<void>`
  - `controllers: Controller[]` (required)
    - any class with the Controller Decorator.
    - Throws error with information about the class if a undecorated class is passed
  - `expressApplication: Express.Application` (required)

### Example:

```typescript
// server.ts
const port = 5000;
const expressApp = express();
const appV1 = new VaporApp({
  path: '/v1',
  showApi: true,
  middleware: [pathMiddleware, express.json()],
  controllers: [new SatelliteController()],
  expressApplication: expressApp
});

expressApp.listen(port, () => {
  console.log(`App listening on the port ${port}`);
  if (appV1.showApi) console.log(`View v1: http://localhost:${port}${appV1.path}`);
});
```

#### Created By Michael Winberry
