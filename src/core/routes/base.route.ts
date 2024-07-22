import { Request, Response, Router } from "express";
import { IBaseLiteModel } from "../models";
import { ICollectionController } from "../controllers/base.controller";
import { logger } from "../utils/logger";
import {
  IListRespModel,
  IPageRespModel,
  IRespModel,
  RespModel,
  SORT_EXPRN,
  parseSortExpression,
} from "../models/transport.model";
import { IAuthContext, IRequireAuthContext } from "../auth.context";
import { Controller } from "tsoa";

export type HTTPMethod =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";

export type ROUTE_OPTIONS = "crud" | "readonly" | "create-readonly" | "none";

export interface ICustomRouteBuilder {
  buildPatchFieldRoutes(fields: string[]): Router;
  buildCustomPostRoute<T>(
    path: string,
    handler: (req: Request) => Promise<IRespModel<T>>
  ): Router;
  buildCustomGetRoute<T>(
    path: string,
    handler: (req: Request) => Promise<IRespModel<T>>
  ): Router;
}

export interface IAbstractRouteBuilder extends ICustomRouteBuilder {
  router: Router;
  routePrefix: string;
  options: ROUTE_OPTIONS;
}

export interface ICRUDRouteBuilder extends IAbstractRouteBuilder {
  // buildCRUDRoutes(): () => Router;

  buildGetPageRoute(): Router;
  buildGetRoute(): Router;
  buildGetByIdRoute(): Router;
  buildPostRoute(): Router;
  buildPutRoute(): Router;
  buildDeleteRoute(): Router;
}

export abstract class AbstractRouteBuilder
  implements ICRUDRouteBuilder, IAbstractRouteBuilder
{
  router: Router;
  routePrefix: string;
  options: ROUTE_OPTIONS = "crud";

  constructor(routePrefix: string, options: ROUTE_OPTIONS = "crud") {
    this.options = options;
    this.routePrefix = routePrefix;
    this.router = Router();

    this.buildCRUDRoutes()();
  }

  buildCRUDRoutes(): () => Router {
    return () => {
      var routes_registred = [];
      if (
        this.options === "crud" ||
        this.options === "create-readonly" ||
        this.options === "readonly"
      ) {
        routes_registred.push("GET");
        routes_registred.push("GET /page");
        routes_registred.push("GET /{id}");
        this.buildGetPageRoute();
        this.buildGetRoute();
        this.buildGetByIdRoute();
      }

      if (this.options === "crud" || this.options === "create-readonly") {
        routes_registred.push("PUT");
        this.buildPutRoute();
      }

      if (this.options === "crud") {
        routes_registred.push("POST /{id}");
        routes_registred.push("DELETE /{id}");
        this.buildPostRoute();
        this.buildDeleteRoute();
      }

      logger.log("Routes", this.routePrefix, routes_registred.join(", "));
      return this.router;
    };
  }

  abstract buildGetPageRoute(): Router;
  abstract buildGetRoute(): Router;
  abstract buildGetByIdRoute(): Router;
  abstract buildPostRoute(): Router;
  abstract buildPutRoute(): Router;
  abstract buildDeleteRoute(): Router;

  abstract buildPatchFieldRoutes(fields: string[]): Router;
  abstract buildCustomPostRoute<T>(
    path: string,
    handler: (req: Request) => Promise<IRespModel<T>>
  ): Router;
  abstract buildCustomGetRoute<T>(
    path: string,
    handler: (req: Request) => Promise<IRespModel<T>>
  ): Router;
}

export class ModelRouteBuilder<T extends IBaseLiteModel>
  extends AbstractRouteBuilder
  implements ICRUDRouteBuilder, IAbstractRouteBuilder, IRequireAuthContext
{
  doController: ICollectionController<T>;
  authContext?: IAuthContext;

  setContext(authContext?: IAuthContext): void {
    this.authContext = authContext;
    this.doController.setContext(this.authContext);
  }

  get tenantId(): string | undefined {
    return this.authContext?.tenantId;
  }

  get userId(): string | undefined {
    return this.authContext?.userId;
  }

  constructor(
    routePrefix: string,
    doController: ICollectionController<T>,
    options: ROUTE_OPTIONS = "crud"
  ) {
    super(routePrefix, options);
    this.doController = doController;
  }

  assertAndSetClaims(req: Request) {
    const tenantId = req.headers["tenantId"] as string;
    const userId = req.headers["userId"] as string;
    this.setContext({ tenantId, userId });
  }

  buildGetPageRoute(): Router {
    return this.router.get(
      `${this.routePrefix}/q`,
      async (req: Request, res: Response) => {
        this.assertAndSetClaims(req);

        const { page, limit, sort } = req.query;
        const sortParam = sort
          ? parseSortExpression(sort as string)
          : undefined;
        const resources = await this.doController.getPage(
          parseInt((page as string) ?? 0),
          parseInt((limit as string) ?? 10),
          sortParam
        );
        return res.status(200).send(resources);
      }
    );
  }

  buildGetRoute(): Router {
    return this.router.get(
      this.routePrefix,
      async (req: Request, res: Response) => {
        this.assertAndSetClaims(req);

        const resources = await this.doController.get();
        return res.status(200).send(resources);
      }
    );
  }

  buildGetByIdRoute(): Router {
    return this.router.get(
      `${this.routePrefix}/:id`,
      async (req: Request, res: Response) => {
        this.assertAndSetClaims(req);

        const id: string = req.params["id"];
        const resource = await this.doController.getById(id);
        return res.status(200).send(resource);
      }
    );
  }

  buildCustomGetRoute<T>(
    path: string,
    handler: (req: Request) => Promise<IRespModel<T>>
  ): Router {
    logger.log("Custom Get", this.routePrefix, `[GET] ${path}`);
    this.router.get(`${this.routePrefix}${path}`, async (req, res) => {
      this.assertAndSetClaims(req);
      try {
        const resource = await handler(req);
        return res.status(resource.status).send(resource);
      } catch (err: any) {
        return res
          .status(500)
          .send(
            new RespModel(
              undefined,
              { message: err?.message ?? err, code: err?.code ?? 500 },
              500
            )
          );
      }
    });

    return this.router;
  }

  buildCustomPostRoute<T>(
    path: string,
    handler: (req: Request) => Promise<IRespModel<T>>
  ): Router {
    logger.log("Custom Post", this.routePrefix, `[POST] ${path}`);
    this.router.post(`${this.routePrefix}${path}`, async (req, res) => {
      this.assertAndSetClaims(req);
      try {
        const resource = await handler(req);
        return res.status(resource.status).send(resource);
      } catch (err: any) {
        return res
          .status(500)
          .send(
            new RespModel(
              undefined,
              { message: err?.message ?? err, code: err?.code ?? 500 },
              500
            )
          );
      }
    });

    return this.router;
  }

  buildPatchFieldRoutes(fields: string[]): Router {
    fields.forEach((field) => {
      const patchRoute = `${this.routePrefix}/:id/:${field}`;
      logger.log("Custom Patch", this.routePrefix, `[PATCH] ${patchRoute}`);
      this.router.patch(patchRoute, async (req: Request, res: Response) => {
        this.assertAndSetClaims(req);

        const id: string = req.params["id"];
        const inputResource = req.body;
        try {
          const resource = await this.doController.updatePartialField(
            id,
            field,
            inputResource
          );
          return res.status(201).send(resource);
        } catch (err: any) {
          return res
            .status(500)
            .send(
              new RespModel(
                undefined,
                { message: err?.message ?? err, code: err?.code ?? 500 },
                500
              )
            );
        }
      });
    });

    return this.router;
  }

  buildPostRoute(): Router {
    return this.router.post(
      `${this.routePrefix}/:id`,
      async (req: Request, res: Response) => {
        this.assertAndSetClaims(req);

        const id: string = req.params["id"];
        const inputResource: T = req.body;
        try {
          const resource = await this.doController.update(id, inputResource);
          return res.status(201).send(resource);
        } catch (err: any) {
          return res
            .status(500)
            .send(
              new RespModel(
                undefined,
                { message: err?.message ?? err, code: err?.code ?? 500 },
                500
              )
            );
        }
      }
    );
  }

  buildPutRoute(): Router {
    return this.router.put(
      this.routePrefix,
      async (req: Request, res: Response) => {
        this.assertAndSetClaims(req);

        const inputResource: T = req.body;
        try {
          const resource = await this.doController.add(inputResource);
          return res.status(201).send(resource);
        } catch (err: any) {
          return res
            .status(500)
            .send(
              new RespModel(
                undefined,
                { message: err?.message ?? err, code: err?.code ?? 500 },
                500
              )
            );
        }
      }
    );
  }

  buildDeleteRoute(): Router {
    return this.router.delete(
      `${this.routePrefix}/:id`,
      async (req: Request, res: Response) => {
        this.assertAndSetClaims(req);

        const id: string = req.params["id"];
        try {
          // var data: T = req.body;
          const deleted = await this.doController.delete(id);
          return res.status(201).send({ deleted });
        } catch (err: any) {
          return res
            .status(500)
            .send(
              new RespModel(
                undefined,
                { message: err?.message ?? err, code: err?.code ?? 500 },
                500
              )
            );
        }
      }
    );
  }
}

export interface IReadonlyCollectionRouter<T extends IBaseLiteModel> {
  get(): Promise<IListRespModel<T>>;
  getPage(
    page: number,
    limit: number,
    sort: string
  ): Promise<IPageRespModel<T>>;
  getById(id: string): Promise<IRespModel<T | null>>;
}
export interface ICreateOnlyCollectionRouter<T extends IBaseLiteModel>
  extends IReadonlyCollectionRouter<T> {
  add(data: T): Promise<IRespModel<T | null>>;
}
export interface ICollectionRouter<T extends IBaseLiteModel>
  extends ICreateOnlyCollectionRouter<T>,
    IReadonlyCollectionRouter<T> {
  update(id: string, data: T): Promise<IRespModel<T | null>>;
  deletePermanent(id: string): Promise<IRespModel<boolean>>;
  delete(id: string): Promise<IRespModel<boolean>>;
}

export abstract class AbstractCollectionRouter<
  T extends IBaseLiteModel
> extends Controller {
  collection: ICollectionController<T>;
  collectionRouter: IAbstractRouteBuilder;

  get router(): Router {
    return this.collectionRouter.router;
  }

  constructor(
    routePrefix: string,
    collection: ICollectionController<T>,
    options: ROUTE_OPTIONS = "readonly"
  ) {
    super();
    this.collection = collection;
    this.collectionRouter = new ModelRouteBuilder<T>(
      routePrefix,
      collection,
      options
    );
    this.buildCustomRoutes(this.collectionRouter);
  }

  abstract buildCustomRoutes(collectionRouter: IAbstractRouteBuilder): void;
}

export abstract class ReadonlyCollectionRouter<T extends IBaseLiteModel>
  extends AbstractCollectionRouter<T>
  implements IReadonlyCollectionRouter<T>
{
  constructor(
    routePrefix: string,
    collection: ICollectionController<T>,
    options: ROUTE_OPTIONS = "readonly"
  ) {
    super(routePrefix, collection, options);
  }

  /**
   * Returns all resources from persistance
   */
  // @Get("/")
  async get(): Promise<IListRespModel<T>> {
    return await this.collection.get();
  }

  /**
   * Returns page wise resources from persistance
   * @param page page number
   * @param limit page length
   * @param sort sort expression
   * @returns page wise resources
   */
  // @Get("/q")
  async getPage(
    // @Query()
    page: number,
    // @Query()
    limit: number,
    // @Query("sort")
    sort: string
  ): Promise<IPageRespModel<T>> {
    return await this.collection.getPage(
      page,
      limit,
      sort as any as SORT_EXPRN
    );
  }

  /**
   * Returns a resource from the persistance by matching hte id
   * @param id primary id of a resource
   */
  // @Get("/:id")
  async getById(id: string): Promise<IRespModel<T | null>> {
    return await this.collection.getById(id);
  }
}

export abstract class CreateOnlyCollectionRouter<T extends IBaseLiteModel>
  extends ReadonlyCollectionRouter<T>
  implements ICreateOnlyCollectionRouter<T>
{
  constructor(
    routePrefix: string,
    collection: ICollectionController<T>,
    options: ROUTE_OPTIONS = "create-readonly"
  ) {
    super(routePrefix, collection, options);
  }

  /**
   * Add a new resource to persistance
   * @param data resource to be added to persistance
   */
  // @Put("/")
  async add(data: T): Promise<IRespModel<T | null>> {
    return await this.collection.add(data);
  }
}

export abstract class CollectionRouter<T extends IBaseLiteModel>
  extends CreateOnlyCollectionRouter<T>
  implements
    ICollectionRouter<T>,
    ICreateOnlyCollectionRouter<T>,
    IReadonlyCollectionRouter<T>
{
  constructor(
    routePrefix: string,
    collection: ICollectionController<T>,
    options: ROUTE_OPTIONS = "crud"
  ) {
    super(routePrefix, collection, options);
  }

  /**
   * update a resource from the persistance
   * @param id primary id of a resource
   * @param data resource attributeds to be updated
   */
  // @Post("/:id")
  async update(id: string, data: T): Promise<IRespModel<T | null>> {
    return await this.collection.update(id, data);
  }

  /**
   * remove a resource from persistance (permanent delete)
   * @param id id of resource to be deleted
   */
  // @Delete("/:id/permanent")
  async deletePermanent(id: string): Promise<IRespModel<boolean>> {
    return await this.collection.deletePermanent(id);
  }

  /**
   * remove a resource from persistance (soft delete)
   * @param id id of resource to be deleted
   */
  //  @Delete("/:id")
  async delete(id: string): Promise<IRespModel<boolean>> {
    return await this.collection.delete(id);
  }
}
