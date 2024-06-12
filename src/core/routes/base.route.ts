import { Request, Response, Router } from "express";
import { ICoreLiteModel } from "../models";
import { ICoreOperations } from "../ops/base.ops";
import { logger } from "../utils/logger";
import { parseSortExpression } from "../models/transport.model";

export abstract class AbstractRouteBuilder {
  router: Router;
  routePrefix: string;

  constructor(routePrefix: string) {
    this.routePrefix = routePrefix;
    this.router = Router();
  }

  buildCRUDRoutes(): Router {
    this.buildGetPageRoute();
    this.buildGetRoute();
    this.buildGetByIdRoute();
    this.buildPostRoute();
    this.buildPutRoute();
    this.buildDeleteRoute();

    logger.log("Routes", this.routePrefix, "GET, PUT, POST, DELETE");
    return this.router;
  }

  abstract buildGetPageRoute(): Router;
  abstract buildGetRoute(): Router;
  abstract buildGetByIdRoute(): Router;
  abstract buildPostRoute(): Router;
  abstract buildPutRoute(): Router;
  abstract buildDeleteRoute(): Router;

  abstract buildPatchFieldRoutes(fields: string[]): Router;
}

export class RESTRouteBuilder<
  T extends ICoreLiteModel
> extends AbstractRouteBuilder {
  doOps: ICoreOperations<T>;

  constructor(routePrefix: string, doOps: ICoreOperations<T>) {
    super(routePrefix);

    this.doOps = doOps;
  }

  assertAndSetClaims(req: Request) {
    this.doOps.tenantId = req.headers["tenantId"] as string;
    this.doOps.userId = req.headers["userId"] as string;
  }

  buildGetPageRoute(): Router {
    return this.router.get(
      `${this.routePrefix}/page`,
      async (req: Request, res: Response) => {
        this.assertAndSetClaims(req);

        const { page, limit, sort } = req.query;
        const sortParam = sort
          ? parseSortExpression(sort as string)
          : undefined;
        // logger.log("get");
        const resources = await this.doOps.getPage(
          parseInt((page as string) ?? 0),
          parseInt((limit as string) ?? 10),
          sortParam
        );
        // logger.log("get completed");
        return res.status(200).send(resources);
      }
    );
  }

  buildGetRoute(): Router {
    return this.router.get(
      this.routePrefix,
      async (req: Request, res: Response) => {
        this.assertAndSetClaims(req);

        // logger.log("get");
        const resources = await this.doOps.get();
        // logger.log("get completed");
        return res.status(200).send(resources);
      }
    );
  }

  buildGetByIdRoute(): Router {
    return this.router.get(
      `${this.routePrefix}/:id`,
      async (req: Request, res: Response) => {
        this.assertAndSetClaims(req);

        // logger.log("get one");
        var id: string = req.params["id"];
        const resource = await this.doOps.getById(id);
        // logger.log("get one completed");
        return res.status(200).send(resource);
      }
    );
  }

  buildPatchFieldRoutes(fields: string[]): Router {
    fields.forEach((field) => {
      const patchRoute = `${this.routePrefix}/:id/:${field}`;
      logger.log("Routes", patchRoute, "PATCH");
      this.router.patch(patchRoute, async (req: Request, res: Response) => {
        this.assertAndSetClaims(req);

        var id: string = req.params["id"];
        var inputResource: any = req.body;
        const resource = await this.doOps.updatePartialField(
          id,
          field,
          inputResource
        );
        return res.status(201).send(resource);
      });
    });

    return this.router;
  }

  buildPostRoute(): Router {
    return this.router.post(
      `${this.routePrefix}/:id`,
      async (req: Request, res: Response) => {
        this.assertAndSetClaims(req);

        var id: string = req.params["id"];
        var inputResource: T = req.body;
        // logger.log("update", data);
        const resource = await this.doOps.update(id, inputResource);
        // logger.log("update completed");
        return res.status(201).send(resource);
      }
    );
  }

  buildPutRoute(): Router {
    return this.router.put(
      this.routePrefix,
      async (req: Request, res: Response) => {
        this.assertAndSetClaims(req);

        var inputResource: T = req.body;
        // logger.log("create", data);
        const resource = await this.doOps.add(inputResource);
        // logger.log("create completed");
        return res.status(201).send(resource);
      }
    );
  }

  buildDeleteRoute(): Router {
    return this.router.delete(
      `${this.routePrefix}/:id`,
      async (req: Request, res: Response) => {
        this.assertAndSetClaims(req);

        var id: string = req.params["id"];
        // var data: T = req.body;
        // logger.log("delete", data);
        const deleted = await this.doOps.delete(id);
        // logger.log("delete completed");
        return res.status(201).send({ deleted });
      }
    );
  }
}
