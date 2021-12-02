import {
  RouteDoc,
  AppAdapter,
  vaporLogger,
  VaporConfig,
  generatePath,
  VaporController,
  initializeRoutes,
  isVaporController,
  getRoutesDocumentation,
  invalidControllerMessage,
  initControllerMiddleware,
  initializeControllersMessage,
} from '..';
import { Request, Response } from 'express';

export class VaporApp implements VaporConfig {
  public path: string;
  public showApi: boolean;
  public middleware: any[];
  public routeDocs: RouteDoc[] = [];
  public expressApplication: AppAdapter;

  private _controllers: VaporController[];

  get controllers(): VaporController[] {
    return this._controllers;
  }

  set controllers(controllers: VaporController[]) {
    controllers.forEach(controller => {
      if (!isVaporController(controller)) throw new Error(invalidControllerMessage(controller));
    });
    this._controllers = controllers;
  }

  constructor({ path, controllers, showApi = false, middleware = [], expressApplication }: VaporConfig) {
    this.path = generatePath('/', path);
    this.showApi = showApi;
    this.middleware = middleware;
    this.controllers = controllers;
    this.expressApplication = new AppAdapter(expressApplication);

    this.initializeApi();
    this.initializeMiddlewares();
    this.initializeControllers();
  }

  initializeMiddlewares(): void {
    if (this.middleware.length) this.expressApplication.use(this.path, this.middleware);
  }

  initializeControllers(): void {
    this.controllers.forEach(controller => {
      vaporLogger.log(initializeControllersMessage(this.path));
      initControllerMiddleware(this.expressApplication, controller, this.path);
      initializeRoutes(this.path, this.expressApplication, controller);
      this.routeDocs = [...this.routeDocs, ...getRoutesDocumentation(controller)];
    });
  }

  initializeApi(): void {
    if (this.showApi) {
      this.routeDocs.unshift({ method: 'GET', paths: [''] });
      this.api = this.api.bind(this);
      this.expressApplication.get(this.path, this.api);
    }
  }

  api(_req: Request, res: Response): void {
    res.type('html').send(
      `<!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${this.path} API</title>
      </head>
      <body>
        <H1>Active Routes:</H1>
        ${(() => {
          let routesHtml = '';
          this.routeDocs.forEach(val => {
            val.paths.forEach((p: string) => {
              const path = generatePath(this.path, p);
              routesHtml += `<h3>${val.method} : <a href="${path}">${path}</a></h3>`;
            });
          });
          return routesHtml;
        })()}
      </body>
      </html>`
    );
  }
}
