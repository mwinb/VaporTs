import { Application, Request, Response, Router } from 'express';
import { getRoutes, initBaseRoute, initializeRoutes, RouteDoc } from '..';

class DocApp {
  routes: RouteDoc[] = [{ method: 'GET', path: '/' }];

  constructor(
    public route: string,
    public showApi: boolean,
    private controllers: Record<string, any>[],
    private middleWares: any[],
    private app: Application,
    private router: Router
  ) {
    this.initializeMiddlewares();
    this.initializeControllers();
  }

  initializeMiddlewares(): void {
    this.app.use(this.route, this.middleWares);
  }

  initializeControllers(): void {
    this.controllers.forEach(controller => {
      initBaseRoute(this.router, controller);
      initializeRoutes(this.router, controller);
      this.routes = [...this.routes, ...getRoutes(controller)];
    });

    this.app.use(this.route, this.router);

    this.showApi && this.app.use(this.route, this.api);
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
            routesHtml += `<h3>${val.method} : <a href="${this.route}${val.path}">${this.route}${val.path}</a></h3>`;
          });
          return routesHtml;
        })()}
      </body>
      </html>`
    );
  };
}

export default DocApp;
