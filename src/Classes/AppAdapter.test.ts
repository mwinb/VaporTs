import { AppAdapter } from './AppAdapter';
import { getMockExpressLikeApp } from '../__mocks__/ExpressLikeAppMock';

describe('Vape Router', () => {
  it('is successfully constructed if the provided app has all required methods', () => {
    const vapeRouter = new AppAdapter(getMockExpressLikeApp());
    for (const field in vapeRouter.app) {
      vapeRouter[field]('someArg');
      expect(vapeRouter.app[field]).toHaveBeenCalledWith('someArg');
    }
  });

  it('binds the provided app methods to the provided app', () => {
    class RouteCalc {
      use = jest.fn();
      all = jest.fn();
      head = jest.fn();
      listen = jest.fn();

      total = 0;

      delete() {
        this.total = 0;
        return this;
      }
      post(amount: number) {
        this.total += amount;
        return this;
      }
      get() {
        return this.total;
      }
      put(amount: number) {
        return this.post(amount);
      }
      patch(amount: number) {
        this.total = amount;
        return this;
      }
    }
    const routeCalc = new RouteCalc();
    const vapeRouter = new AppAdapter(routeCalc);
    expect(vapeRouter.post(10).put(10).delete().patch(10).get()).toBe(10);
  });

  it('throws an error with the missing method name if the provided app does not have all the required methods', () => {
    const mockVapeRouterMissingRequiredFields = {};
    let caughtException;
    try {
      new AppAdapter(mockVapeRouterMissingRequiredFields);
    } catch (e) {
      caughtException = e;
    }
    expect(caughtException.message).toContain('get');
  });
});
