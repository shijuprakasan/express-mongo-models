import { Body, Delete, Get, Post, Put, Query, Route, Tags } from 'tsoa';
import { IListRespModel, IPageRespModel, IRespModel } from '../core';
import { CollectionRouter, IAbstractRouteBuilder, ICollectionController } from "../core";
import { ITodoModel } from "../models";

@Route("/api/todos")
@Tags("todos")
export class TodoRoute extends CollectionRouter<ITodoModel> {
    constructor(collectionController: ICollectionController<ITodoModel>) {
        super('/api/todos', collectionController);
    }

    buildCustomRoutes(collectionRouter: IAbstractRouteBuilder): void {
    }

    /**
      * Returns all resources from persistance
      */
    @Get("/")
    async get(): Promise<IListRespModel<ITodoModel>> {
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
    ): Promise<IPageRespModel<ITodoModel>> {
        return await super.getPage(page, limit, sort as any);
    }

    /**
    * Returns a resource from the persistance by matching hte id
    * @param id primary id of a resource
    */
    @Get("/:id")
    async getById(id: string): Promise<IRespModel<ITodoModel | null>> {
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
        @Body() data: ITodoModel
    ): Promise<IRespModel<ITodoModel | null>> {
        return await super.update(id, data);
    }

    /**
     * Add a new resource to persistance
     * @param data resource to be added to persistance
     */
    @Put("/")
    async add(@Body() data: ITodoModel): Promise<IRespModel<ITodoModel | null>> {
        return super.add(data as ITodoModel);
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
