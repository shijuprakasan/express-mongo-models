"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageRespModel = exports.ListRespModel = exports.RespModel = exports.SORT_DIRECTION = void 0;
exports.getError = getError;
exports.parseSortExpression = parseSortExpression;
exports.parseSortExpressions = parseSortExpressions;
const errorcodes_1 = require("../errorcodes");
var SORT_DIRECTION;
(function (SORT_DIRECTION) {
    SORT_DIRECTION[SORT_DIRECTION["ASC"] = 1] = "ASC";
    SORT_DIRECTION[SORT_DIRECTION["DESC"] = -1] = "DESC";
})(SORT_DIRECTION || (exports.SORT_DIRECTION = SORT_DIRECTION = {}));
function getError(code) {
    return (0, errorcodes_1.getErrorContent)(code);
}
class RespModel {
    constructor(data, error, status = 200) {
        this.status = 200;
        if (error) {
            this.error = error;
        }
        else {
            this.data = data;
        }
        this.status = status;
    }
}
exports.RespModel = RespModel;
class ListRespModel extends RespModel {
    constructor(data, error) {
        super(data, error);
    }
}
exports.ListRespModel = ListRespModel;
class PageRespModel extends ListRespModel {
    constructor(data, page = 0, limit = 10, error) {
        super(data, error);
        this.page = 0;
        this.limit = 10;
        this.sort = {};
        this.status = 200;
        this.page = page;
        this.limit = limit;
    }
}
exports.PageRespModel = PageRespModel;
function parseSortExpression(sortExpr) {
    var sort = {};
    const sortParts = sortExpr.split(":");
    sort[sortParts[0]] =
        sortParts[1] === "desc" ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC;
    return sort;
}
function parseSortExpressions(sortExpr) {
    var sort = {};
    for (let i = 0; i < sortExpr.length; i++) {
        const sortParts = sortExpr[i].split(":");
        sort[sortParts[0]] =
            sortParts[1] === "desc" ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC;
    }
    return sort;
}
//# sourceMappingURL=transport.model.js.map