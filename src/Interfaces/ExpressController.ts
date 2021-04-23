import { ControllerDoc } from './ControllerDoc';

export interface ExpressController {
  controllerDoc?: ControllerDoc;
}

export const objectIsExpressController = (object: Record<string, any>): object is ExpressController => {
  return 'controllerDoc' in Object.getPrototypeOf(object);
};
