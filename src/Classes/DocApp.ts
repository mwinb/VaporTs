import {
  RouteDoc,
  docTsLogger,
  DocAppConfig,
  DocTsController,
  initializeRoutes,
  isDocTsController,
  getRoutesDocumentation,
  invalidControllerMessage,
  initControllerMiddleware,
  initializeControllersMessage
} from '..';
import { Request, Response, Application } from 'express';

export class DocApp implements DocAppConfig {
  public path: string;
  public routeDocs: RouteDoc[] = [];
  public showApi: boolean;
  public middleware: any[];
  public expressApplication: Application;
  private _controllers: DocTsController[];

  get controllers(): DocTsController[] {
    return this._controllers;
  }

  set controllers(controllers: DocTsController[]) {
    controllers.forEach(controller => {
      if (!isDocTsController(controller)) throw new Error(invalidControllerMessage(controller));
    });
    this._controllers = controllers;
  }

  constructor({
    path = '',
    controllers,
    showApi = false,
    middleware = [],
    expressApplication,
    logger = console.log
  }: DocAppConfig) {
    this.path = path;
    this.showApi = showApi;
    docTsLogger.log = logger;
    this.middleware = middleware;
    this.controllers = controllers;
    this.expressApplication = expressApplication;

    this.initializeApi();
    this.initializeMiddlewares();
    this.initializeControllers();
  }

  initializeMiddlewares(): void {
    if (this.middleware.length) this.expressApplication.use(this.path, this.middleware);
  }

  initializeControllers(): void {
    this.controllers.forEach(controller => {
      docTsLogger.log(initializeControllersMessage(this.path));
      initControllerMiddleware(this.expressApplication, controller);
      initializeRoutes(this.path, this.expressApplication, controller);
      this.routeDocs = [...this.routeDocs, ...getRoutesDocumentation(controller)];
    });
  }

  initializeApi(): void {
    if (this.showApi) {
      this.routeDocs.unshift({ method: 'GET', paths: [this.path.length ? '' : '/'] });
      this.api = this.api.bind(this);
      this.expressApplication.get(this.path, this.api);
    }
  }

  api(_req: Request, res: Response): void {
    res.send(
      `<!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>DocTS ${this.path} API</title>
      </head>
      <body>
        <H1>Active Routes:</H1>
        ${(() => {
          let routesHtml = '';
          this.routeDocs.forEach(val => {
            val.paths.forEach((p: string) => {
              routesHtml += `<h3>${val.method} : <a href="${this.path}${p}">${this.path}${p}</a></h3>`;
            });
          });
          return routesHtml;
        })()}
      </body>
      </html>`
    );
  }
}
