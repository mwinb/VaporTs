# DocTS

DocTs is a minimal framework built to support a simple and only slightly opinionated object oriented approach to implementing and unit testing Expressjs applications. DocTS is primarily focused on the use of two primary decorators. The Controller decorator, which provides a simple way to describe express controllers, their paths, and middleware, and the Route decorator, which provides simple HTTP method declaration, extension to the Controller path, individual middleware, and a prebuilt optional asynchronous http error response handler.

---

## Installation:

`npm i --save @mwinberry/doc-ts`

---

# Decorators

## Controller

### Parameters:

- `Path: String` (required)
- `Middleware: Middleware[]` (optional)

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

- `Method: string` (required)
  - `'POST' | 'PATCH' | 'PUT' | 'GET' | 'DELETE' | 'HEAD' | 'CONNECT' | 'OPTIONS' | 'TRACE'`
- `RouteParams: { } `(optional)
  - `path: string | string[]` (optional)
  - `middleware: Middleware[]` (optional)
  - `applyHttpError: boolean `(optional, default: true)

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

## Validate

In order to use Validate an instance of a class that uses one of the Validation Decorators is needed. Handles all validation failures with the HttpError class. See the DocTsValidator Class description below.

### Parameters:

- `validator: DocTsValidator` (required)
  - The DocTsValidator meta data is applied to any class that uses a validator decorator.
  - Throws an `HttpError` with a `400` status and information about the value and field that failed.
- `requestFieldToValidate: string` (required)
  - The Express Request(req) field upon which validation will be run:
    - `'body' | 'params' | 'query' ...`
    - Throws an `HttpError` with a `501` status and logs information about the function if invalid field is provided.

### Examples:

```typescript
class ExampleValidator {
  @String()
  someString: string;
}

@Controller('/example')
class ExampleController {
  @Route('PATCH')
  @Validate(new ExampleValidator(), 'body')
  examplePatch(req, res) {}
}
```

## Validators

Field decorators can be used to create a DocTsValidator needed in the Validate Decorator. There are two types of Validators:

## Primitive

- `@String`
  - Validates that field is a string.
- `@Boolean`
  - Validates that field is a boolean.
- `@Number`
  - Validates that field is a number.
- `@JsonObject`
  - Validates that field is of type object ({})

### Params

- `validationConfig: ValidatorFieldConfig {}` (optional)
  - `isArray: boolean (optional, default: false)`
    - Adds Array Validation to the field.
  - `evaluateEachItem: boolean (optional, default: true)`
    - Validates each item in array when field isArray.
    - Currently disabling removes type evaluation and only ensures that the field is an Array.
  - `optional: boolean (optional, default: false)`
    - Will not throw HttpError if undefined.
    - Still validates the field if it exists.
  - `evaluators: Evaluator[]` (optional)
    - Additional custom validation functions to be run against the field.
    - Does not replace the current evaluator.
  - `type Evaluator = (valueToValidate: any) => boolean`

### Example

```typescript
class ExampleDocTsValidator {
  @String({ evaluators: [isObjectId] })
  id: ObjectId;

  @String()
  stringField: string;

  @Number()
  numberField: number;

  @Boolean()
  booleanField: boolean;

  @JsonObject({ optional: true })
  jsonObject: {};

  @String({ isArray: true })
  stringArray: string[];
}
```

## Specialized

- `@Validator` (use for nested DocTsValidator objects)
  - Params
    - `validator: DocTsValidator` (required)
    - `validationConfig: ValidatorFieldConfig` (required)
  - Defaults to JsonObject validation if DocTsValidator is not passed in the validator param.
- `@SetPropertyEvaluators` (Suggested as return value for custom validators, but it may be used directly.)
  - `validationConfig: ValidatorFieldConfig` (required)

### Example

```typescript
class SpecializedValidators {
  @SetPropertyEvaluators({
    isArray: false,
    evaluateEachItem: false,
    optional: true,
    evaluators: [isObjectId]
  })
  id: ObjectId;

  @Validator(new ExampleDocTsValidator(), { isArray: true })
  examples: ExampleDocTsValidator[];
}
```

### Example Custom Validator

```typescript
const ValidateObjectId = (validationConfig: ValidatorFieldConfig = {}): PropertyDecorator => {
  const config = { ...DEFAULT_VALIDATOR_CONFIG, ...validationConfig };
  const evaluators = [isObjectId, ...config.evaluators];
  return SetPropertyEvaluators({ ...config, evaluators });
};

class CustomValidatorExample {
  @ValidateObjectId()
  Id: ObjectId;
}
```

---

## HttpErrorHandler

The HttpErrorHandler is applied to all Routes and Validators by default, but can also be used as an individual decorator. This handler wraps asynchronous Route or Validate decorated functions in a try catch that listens for an HttpError to be thrown. The HttpError takes in the code and the response message. When caught by the handler, the express response status is set to the HttpError code and a json object with the code and message are sent. All uncaught errors respond with a 500 and an ambiguous error message. Uncaught errors are also logged to the console.

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

The DocApp class is responsible for binding all routes, methods, and middleware to an express application. It is recommended that any DocApp classes (many can be initialized for version control purposes) be instantiated at entry point of the application.

### Parameters:

- `DocAppConfig: {}`
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
    - Throws error with information about the class if a non-controller decorated classes are passed
  - `expressApplication: Express.Application` (required)
  - `router: Express.Router` (required)

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

- `code: number` (required)
- `message: string` (required)

### Example:

```typescript
throw new HttpError(404, 'Not Found');
```

### Example application @ https://github.com/mwinb/DocTS/tree/main/example

#### Created By Michael Winberry
