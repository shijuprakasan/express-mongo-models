import { CollectionRouter, IAbstractRouteBuilder } from '../core/routes';
import { IKeychainController } from '../controllers';
import { Body, Delete, Get, Post, Put, Query, Route, Tags } from 'tsoa';
import { IKeychainLiteModel, IKeychainModel } from '../models';
import { IListRespModel, IPageRespModel, IRespModel } from '../core';

const ROUTE_PREFIX = '/api/keychains';

@Route("/api/keychains")
@Tags("Keychains")
export class KeychainRoute extends CollectionRouter<IKeychainModel> {
    controller: IKeychainController;

    constructor(controller: IKeychainController) {
        super(ROUTE_PREFIX, controller)
        this.controller = controller;
    }

    buildCustomRoutes(collectionRouter: IAbstractRouteBuilder): void {
        collectionRouter.buildCustomGetRoute("/:id/lite", async (req) => {
            return await this.getLiteById(req.params.id);
        });
        collectionRouter.buildCustomGetRoute("/:id/children", async (req) => {
            return await this.getChildrenById(req.params.id);
        });
        collectionRouter.buildCustomGetRoute("/:id/full", async (req) => {
            return await this.getFullById(req.params.id);
        });
    }

    /**
     * Returns a resource from the persistance by matching hte id
     * @param id primary id of a resource
     */
    @Get("/:id/lite")
    async getLiteById(id: string): Promise<IRespModel<IKeychainLiteModel | null>> {
        return await this.controller.getLiteById(id);
    }

    /**
     * Returns a resource from the persistance by matching hte id
     * @param id primary id of a resource
     */
    @Get("/:id")
    async getById(id: string): Promise<IRespModel<IKeychainModel | null>> {
        return await super.getById(id);
    }

    /**
     * Returns a resource from the persistance by matching hte id
     * @param id primary id of a resource
     */
    @Get("/:id/children")
    async getChildrenById(id: string): Promise<IRespModel<IKeychainLiteModel[]>> {
        return await this.controller.getChildrenById(id);
    }

    /**
     * Returns a resource from the persistance by matching hte id
     * @param id primary id of a resource
     */
    @Get("/:id/full")
    async getFullById(id: string): Promise<IRespModel<IKeychainModel | null>> {
        return await this.controller.getFullById(id);
    }

    /**
     * Returns all resources from persistance
     */
    @Get("/")
    async get(): Promise<IListRespModel<IKeychainModel>> {
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
    ): Promise<IPageRespModel<IKeychainModel>> {
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
        @Body() data: IKeychainModel
    ): Promise<IRespModel<IKeychainModel | null>> {
        return await super.update(id, data);
    }

    /**
     * Add a new resource to persistance
     * @param data resource to be added to persistance
     */
    @Put("/")
    async add(@Body() data: IKeychainLiteModel): Promise<IRespModel<IKeychainModel | null>> {
        return super.add(data as IKeychainModel);
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
