import { Application, Router, Request, Response } from 'express';
import { initializeRoutes, getRouteDocs } from '../Decorators/Route';
import { initControllerMiddleware } from '../Decorators/Controller';
import { DocAppConfig } from '../Interfaces/DocAppConfig';
import { RouteDoc } from '../Interfaces/RouteDoc';

export class DocApp implements DocAppConfig {
  routes: RouteDoc[] = [];
  public showApi: boolean;
  public path: string;
  public controllers: Record<string, any>[];
  public middleware: any[];
  public expressApplication: Application;
  public router: Router;

  constructor({
    path = '',
    showApi = false,
    middleware = [],
    controllers,
    expressApplication: app,
    router
  }: DocAppConfig) {
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
      if (Object.getPrototypeOf(controller).controllerDoc) {
        initControllerMiddleware(this.router, controller);
        initializeRoutes(this.router, controller);
        this.routes = [...this.routes, ...getRouteDocs(controller)];
      }
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
