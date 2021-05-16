import {
  RouteDoc,
  docTsLogger,
  DocAppConfig,
  DocTsController,
  initializeRoutes,
  isDocTsController,
  getRoutesDocumentation,
  initControllerMiddleware
} from '..';
import { Application, Router, Request, Response } from 'express';

export class DocApp implements DocAppConfig {
  public path: string;
  public router: Router;
  routes: RouteDoc[] = [];
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
    router,
    path = '',
    controllers,
    showApi = false,
    middleware = [],
    logger = console.log,
    expressApplication: app
  }: DocAppConfig) {
    this.path = path;
    this.router = router;
    this.showApi = showApi;
    docTsLogger.log = logger;
    this.middleware = middleware;
    this.expressApplication = app;
    this.controllers = controllers;
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
      this.routes = [...this.routes, ...getRoutesDocumentation(controller)];
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
