import { Request, Response } from 'express';
import { Controller } from '../Decorators/Controller';
import { mockMiddleware } from './Express/mockMiddleware';
@Controller('/test')
export class MockControllerWithoutMiddleWare {
  constructor() {}
}

@Controller('/test', [mockMiddleware])
export class MockControllerWithMiddleWare {
  constructor() {}
}
