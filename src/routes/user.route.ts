import { Body, Delete, Get, Post, Put, Query, Route, Tags } from 'tsoa';
import { CollectionRouter, IAbstractRouteBuilder } from "../core/routes/base.route";
import { IUserController, UserController } from "../controllers";
import { UserCollection } from "../data";
import { IRegisterModel } from "../models";
import { IListRespModel, IPageRespModel, IRespModel, IUserModel } from '../core';

const ROUTE_PREFIX = "/api/users";

@Route("/api/users")
@Tags("Users")
export class UserRoute extends CollectionRouter<IUserModel> {
  controller: IUserController;

  constructor(controller: IUserController) {
    super(ROUTE_PREFIX, controller)
    this.controller = controller;
  }

  buildCustomRoutes(collectionRouter: IAbstractRouteBuilder): void {
  }

  @Post("/register")
  public async register(
    @Body() data: IRegisterModel
  ): Promise<IRespModel<IUserModel>> {
    return await this.controller.register(data);
  }

  /**
    * Returns all resources from persistance
    */
  @Get("/")
  async get(): Promise<IListRespModel<IUserModel>> {
    return await super.get();
  }

  /**
   * Returns page wise resources from persistance
   * @param page page number
   * @param limit page length
   * @param sort sort expression
   * @returns page wise resources
   */
  @Get("/q")
  async getPage(
    @Query()
    page: number,
    @Query()
    limit: number,
    @Query("sort")
    sort: string
  ): Promise<IPageRespModel<IUserModel>> {
    return await super.getPage(page, limit, sort as any);
  }

  /**
   * update a resource from the persistance
   * @param id primary id of a resource
   * @param data resource attributeds to be updated
   */
  @Post("/:id")
  async update(
    id: string,
    @Body() data: IUserModel
  ): Promise<IRespModel<IUserModel | null>> {
    return await super.update(id, data);
  }

  /**
  * Returns a resource from the persistance by matching hte id
  * @param id primary id of a resource
  */
  @Get("/:id")
  async getById(id: string): Promise<IRespModel<IUserModel | null>> {
    return await super.getById(id);
  }

  /**
   * Add a new resource to persistance
   * @param data resource to be added to persistance
   */
  @Put("/")
  async add(@Body() data: IUserModel): Promise<IRespModel<IUserModel | null>> {
    return super.add(data as IUserModel);
  }

  /**
   * remove a resource from persistance (permanent delete)
   * @param id id of resource to be deleted
   */
  @Delete("/:id/permanent")
  async deletePermanent(id: string): Promise<IRespModel<boolean>> {
    return super.deletePermanent(id);
  }

  /**
   * remove a resource from persistance (soft delete)
   * @param id id of resource to be deleted
   */
  @Delete("/:id")
  async delete(id: string): Promise<IRespModel<boolean>> {
    return super.delete(id);
  }
}
