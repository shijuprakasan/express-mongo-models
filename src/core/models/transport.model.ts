export type SORT_EXPRN = { [key: string]: SORT_DIRECTION };
export type RES_STATUS_CODE = 200 | 201 | 400 | 404 | 401 | 403 | 500;
export enum SORT_DIRECTION {
  ASC = 1,
  DESC = -1,
}

export interface ErrorRes {
  code?: number;
  message: string;
}

export interface IReqCoreModel {}
export interface IReqModel<T> extends IReqCoreModel {
  data?: T;
}

export interface IRespBaseModel {
  status: RES_STATUS_CODE;
}

export interface IRespModel<T> extends IRespBaseModel {
  data?: T;
  error?: ErrorRes;
}

export interface IListRespModel<T> extends IRespBaseModel {
  data?: T[];
  error?: ErrorRes;
}

export interface IPageRespModel<T> extends IListRespModel<T> {
  page: number;
  limit: number;
  sort: { [key: string]: SORT_DIRECTION };
}

export class RespModel<T> implements IRespModel<T> {
  data?: T;
  error?: ErrorRes;
  status: RES_STATUS_CODE = 200;

  constructor(data?: T, error?: ErrorRes) {
    if (error) {
      this.error = error;
    } else {
      this.data = data;
    }
  }
}

export class ListRespModel<T> extends RespModel<T[]> {
  constructor(data?: T[], error?: ErrorRes) {
    super(data, error);
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

  constructor(
    data?: T[],
    page: number = 0,
    limit: number = 10,
    error?: ErrorRes
  ) {
    super(data, error);
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
