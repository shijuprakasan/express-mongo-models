export type SORT_EXPRN = { [key: string]: SORT_DIRECTION };
export type RES_STATUS_CODE = 200 | 201 | 400 | 404 | 401 | 403 | 500;
export enum SORT_DIRECTION {
  ASC = 1,
  DESC = -1,
}

export interface IReqCoreModel {}
export interface IReqModel<T> extends IReqCoreModel {
  data: T;
}

export interface IRespBaseModel {
  status: RES_STATUS_CODE;
}

export interface IRespModel<T> extends IRespBaseModel {
  data: T;
}

export interface IListRespModel<T> extends IRespModel<T[]>, IRespBaseModel {}

export interface IPageRespModel<T> extends IListRespModel<T>, IRespBaseModel {
  page: number;
  limit: number;
  sort: { [key: string]: SORT_DIRECTION };
}

export class RespModel<T> implements IRespModel<T> {
  data: T;
  status: RES_STATUS_CODE = 200;

  constructor(data: T | null) {
    this.data = data as T;
  }
}

export class ListRespModel<T> implements IListRespModel<T> {
  data: T[] = [];
  status: RES_STATUS_CODE = 200;

  constructor(data: T[]) {
    this.data = data;
  }
}

export class PageRespModel<T>
  extends ListRespModel<T>
  implements IPageRespModel<T>
{
  page: number = 0;
  limit: number = 10;
  sort: SORT_EXPRN = {};
  status: RES_STATUS_CODE = 200;

  constructor(data: T[], page: number = 0, limit: number = 10) {
    super(data);
    this.page = page;
    this.limit = limit;
  }
}

export function parseSortExpression(sortExpr: string): SORT_EXPRN {
  var sort: { [key: string]: SORT_DIRECTION } = {};

  const sortParts = sortExpr.split(":");
  sort[sortParts[0]] =
    sortParts[1] === "desc" ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC;

  return sort;
}

export function parseSortExpressions(sortExpr: string[]): SORT_EXPRN {
  var sort: { [key: string]: SORT_DIRECTION } = {};

  for (let i = 0; i < sortExpr.length; i++) {
    const sortParts = sortExpr[i].split(":");
    sort[sortParts[0]] =
      sortParts[1] === "desc" ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC;
  }

  return sort;
}
