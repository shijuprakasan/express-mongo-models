import { Body, Delete, Get, Post, Put, Query, Route, Tags } from 'tsoa';
import { ITenantController, TenantController } from '../controllers';
import { CollectionRouter, IAbstractRouteBuilder } from '../core/routes';
import { ITenantModel } from '../core';
import { TenantCollection } from '../data';
import { IListRespModel, IPageRespModel, IRespModel } from '../core';

const ROUTE_PREFIX = '/api/tenants';

@Route("/api/tenants")
@Tags("Tenants")
export class TenantRoute extends CollectionRouter<ITenantModel> {
    controller: ITenantController;

    constructor(controller: ITenantController) {
        super(ROUTE_PREFIX, controller)
        this.controller = controller;
    }

    buildCustomRoutes(collectionRouter: IAbstractRouteBuilder): void {
    }

    /**
      * Returns all resources from persistance
      */
    @Get("/")
    async get(): Promise<IListRespModel<ITenantModel>> {
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
    ): Promise<IPageRespModel<ITenantModel>> {
        return await super.getPage(page, limit, sort as any);
    }

    /**
    * Returns a resource from the persistance by matching hte id
    * @param id primary id of a resource
    */
    @Get("/:id")
    async getById(id: string): Promise<IRespModel<ITenantModel | null>> {
        return await super.getById(id);
    }

    /**
     * update a resource from the persistance
     * @param id primary id of a resource
     * @param data resource attributeds to be updated
     */
    @Post("/:id")
    async update(
        id: string,
        @Body() data: ITenantModel
    ): Promise<IRespModel<ITenantModel | null>> {
        return await super.update(id, data);
    }

    /**
     * Add a new resource to persistance
     * @param data resource to be added to persistance
     */
    @Put("/")
    async add(@Body() data: ITenantModel): Promise<IRespModel<ITenantModel | null>> {
        return super.add(data as ITenantModel);
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
