# DocTS

DocTs is a minimal framework built to support a simple and only slightly opinionated object oriented approach to implementing and unit testing Expressjs applications. DocTS is primarily focused on the use of two primary decorators. The Controller decorator, which provides a simple way to describe express controllers, their paths, and middleware. The Route decorator, which provides simple HTTP method declaration, extension to the Controller path, individual middleware, and optional error, response, and validation handling.

---

## Installation:

`npm i --save @mwinberry/doc-ts`

---
### Example application
- https://github.com/mwinb/DocTS/tree/main/example
### Starter with mongo
- https://github.com/mwinb/docts_mongo_starter
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

- `@Route` Does not alter the original class method declaration.

### Parameters:

- `Method: string` (required)
  - `'POST' | 'PATCH' | 'PUT' | 'GET' | 'DELETE' | 'HEAD' | 'CONNECT' | 'OPTIONS' | 'TRACE'`
- `RouteParams: { } `(optional)
  - `path: string | string[]` (optional)
  - `middleware: Middleware[]` (optional)
  - `handleErrors: boolean` (optional, default: true)
  - `handleResponse: boolean` (optional, default: true)
  - `responseCode: number` (optional, default: 200)

### Examples:

```typescript
@Controller('/example')
class ExampleController {
  @Route('GET')
  async exampleGetFunction(): Promise<ExampleData[]> {}

  @Route('POST', { responseCode: 201 })
  async postWithCustomResponseCode({ body: postData }: express.Request): Promise<void> {}

  @Route('GET', { path: '/:id', middleware: [routeMiddleware] })
  async exampleGetOneFunction({ params: { id } }: express.Request): Promise<ExampleData> {}

  @Route('GET', { path: ['/pathone', '/pathtwo'] })
  async exampleGetWithTwoPaths(req): Promise<ExampleData[]> {}

  @Route('PATCH', { handleErrors: false, handleResponse: false })
  async examplePatchNoHandlers(req, res, next): Promise<void> {}
}
```

## Route Handlers

### handleErrors

Error handling is applied to all Routes and Validators by default, but may be disabled in the `RouteParams`. This handler wraps asynchronous Route or Validate decorated functions in a try catch that listens for an HttpError to be thrown. The HttpError takes in the code and the response message. When caught by the handler, the express response status is set to the HttpError code and a json object with the code and message are sent. All non HttpErrors are caught and handled with a 500 and a non-specific error message. Non HttpErrors are also logged with the DocApp logger (default: `console.log`);

- Using `@Route` maintains the class method functionality and only alters the bound method prior to being applied to the express route see the [example](https://github.com/mwinb/DocTS/tree/main/example) unit and integration tests for functionality.

### Example - response (caught):

```typescript
res.status(404).send({ code: 404, message: 'Not Found' });
```

### Example - response (uncaught):

```typescript
res.status(500).send({ code: 500, message: 'Oops something went wrong.' });
```

### handleResponse

Response handling is applied to all Routes by default, but may be disabled in the `RouteParams`. This handler wraps an `@Route` decorated method. When the decorated method returns data it is handled with `res.status` and `res.send`. For void methods `res.sendStatus` is used instead. The default status code is `200`, but can be changed in the `RouteParams`.

- Using `@Route` maintains the class functionality and only alters the bound method prior to being applied to the express route see the [examples](https://github.com/mwinb/DocTS/tree/main/example) unit and integration tests for functionality.

### Example:

```typescript
@Controller('/example')
class ExampleController {
  // Calls res.status(200).send(Example[]) if successful
  @Route('GET')
  async getExamples(): Promise<Example[]> {
    return await this.exampleService.getAllExamples();
  }
  // Calls res.sendStatus(201) if successful
  @Route('PATCH', { responseCode: 201 })
  @Validate(new ExamplePatchValidator(), 'body')
  async patchExampleNoReturn(req: express.Request): Promise<void> {
    await this.exampleService.patch(req.body);
  }
}
```

---

## Validate

In order to use `@Validate` an instance of a class that uses one of the Validation Decorators is needed. `@Validate` Handles all validation failures with the HttpError handler. See the DocTsValidator Class description below.

- `@Validate` does not alter the original class method.
- `@Validate` only works with `@Route` (order in relation to `@Route` does not matter)
- When using more than one `@Validate` they are executed bottom to top.

### Parameters:

- `validator: DocTsValidator` (required)
  - The DocTsValidator meta data is applied to any class that uses a validator decorator.
  - Throws an `HttpError` with a `400` status and information about the value and field that failed.
- `requestFieldToValidate: string` (required)
  - The Express Request(req) field upon which validation will be run:
    - `'body' | 'params' | 'query' ...`
    - Throws an `HttpError` with a `501` status and logs information about the function if invalid field is provided.
- `validateConfig: ValidateConfig` (optional):
  - `isArray` (optional, default: `false`)
    - Adds Array Validation to the `Express.Request` field.
  - `evaluateEachItem` (optional, default: `true`)
    - Validates each item in array when field isArray.
    - Disabling removes type evaluation and only ensures that the field is an Array.
  - `strip:` (optional, default: `true`)
    - Removes any fields not specified in the provided Validator.

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

  @Validate(exampleBodyValidator, 'body') // Executes second.
  @Validate(exampleHeaderValidator, 'headers', { strip: false }) // Executes first.
  @Route('POST', { responseCode: 201 }) // Ordering does not matter.
  async addSat({ body: sat }: express.Request): Promise<ExampleModel> {}
}
```

---

## Validators

Field decorators can be used to create a DocTsValidator needed in the Validate Decorator. There are two types of Validators:

## Primitive

### `@String`

- Validates that field is a string.

### `@Boolean`

- Validates that field is a boolean.

### `@Number`

- Validates that field is a number.

### `@JsonObject`

- Validates that field is of type object ({})

### Params

- `validationConfig: ValidatorFieldConfig {}` (optional)
  - `isArray: boolean` (optional, default: false)
    - Adds Array Validation to the field.
  - `evaluateEachItem: boolean` (optional, default: true)
    - Validates each item in array when field isArray.
    - Disabling removes type evaluation and only ensures that the field is an Array.
  - `optional: boolean` (optional, default: false)
    - Ignores if undefined.
    - Still validates the field if it exists.
  - `evaluators: Evaluator[]` (optional)
    - Additional custom validation functions to be run against the field.
    - Does not replace the default evaluator.
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

### `@Validator` (for nested objects)

- Params

  - `validator: DocTsValidator` (required)
  - `validationConfig: ValidatorConfig` (required)
    - `isArray: boolean` (optional, default: false)
      - Adds Array Validation to the field.
    - `evaluateEachItem: boolean` (optional, default: true)
      - Validates each item in array when field isArray.
      - Currently disabling removes type evaluation and only ensures that the field is an Array.
    - `optional: boolean` (optional, default: false)
      - Will not throw HttpError if undefined.
      - Still validates the field if it exists.
    - `evaluators: Evaluator[]` (optional)
      - Additional custom validation functions to be run against the field.
      - Does not override the default Evaluator.
    - `strip: boolean` (optional, default: true)
      - Removes any fields not specified in the provided Validator.

- Defaults to JsonObject validation if DocTsValidator is not passed in the validator param.

### `@SetPropertyEvaluators`

- Suggested as return value for custom validators, but it may be used directly.

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

# Classes

## DocApp

The DocApp class is responsible for binding all routes, methods, and middleware to an express application.

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
    - Throws error with information about the class if a undecorated class is passed
  - `expressApplication: Express.Application` (required)

### Example:

```typescript
// server.ts
const port = 5000;
const expressApp = express();
const appV1 = new DocApp({
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

---

## HttpError

Extends the Error class and is caught with the HttpError handler decorator or by default in Route decorated async functions. HttpError handler can be disabled by setting the `handleErrors` parameter in `RouteParams` to `false`.

### Parameters:

- `code: number` (required)
- `message: string` (required)

### Example:

```typescript
throw new HttpError(404, 'Not Found');
```

#### Created By Michael Winberry
