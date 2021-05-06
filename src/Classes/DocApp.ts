import {
  RouteDoc,
  DocAppConfig,
  getRouteDocs,
  DocTsController,
  initializeRoutes,
  isDocTsController,
  initControllerMiddleware
} from '..';
import { Application, Router, Request, Response } from 'express';
import { docTsLogger } from './DocTsLogger';

export class DocApp implements DocAppConfig {
  routes: RouteDoc[] = [];
  public path: string;
  public router: Router;
  public showApi: boolean;
  public middleware: any[];
  public expressApplication: Application;
  private _controllers: DocTsController[];

  get controllers(): DocTsController[] {
    return this._controllers;
  }

  set controllers(controllers: DocTsController[]) {
    controllers.forEach(controller => {
      if (!isDocTsController(controller))
        throw new Error(
          `DocTs: ${controller} is not a valid DocTsController. Ensure that it is decorated with @Controller.`
        );
    });
    this._controllers = controllers;
  }

  constructor({
    path = '',
    showApi = false,
    middleware = [],
    logger = console.log,
    controllers,
    expressApplication: app,
    router
  }: DocAppConfig) {
    docTsLogger.log = logger;
    this.path = path;
    this.showApi = showApi;
    this.controllers = controllers;
    this.middleware = middleware;
    this.expressApplication = app;
    this.router = router;
    showApi && this.routes.push({ method: 'GET', paths: [this.path.length ? '' : '/'] });
    this.initializeMiddlewares();
    this.initializeControllers();
  }

  initializeMiddlewares(): void {
    if (this.middleware.length) this.expressApplication.use(this.path, this.middleware);
  }

  initializeControllers(): void {
    this.controllers.forEach(controller => {
      initControllerMiddleware(this.router, controller);
      initializeRoutes(this.router, controller);
      this.routes = [...this.routes, ...getRouteDocs(controller)];
    });

    this.expressApplication.use(this.path, this.router);

    this.showApi && this.expressApplication.use(this.path, this.api);
  }

  api = (_req: Request, res: Response): void => {
    res.send(
      `<!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Api</title>
      </head>
      <body>
        <H1>Active Routes:</H1>
        ${(() => {
          let routesHtml = '';
          this.routes.forEach(val => {
            val.paths.forEach((p: string) => {
              routesHtml += `<h3>${val.method} : <a href="${this.path}${p}">${this.path}${p}</a></h3>`;
            });
          });
          return routesHtml;
        })()}
      </body>
      </html>`
    );
  };
}
