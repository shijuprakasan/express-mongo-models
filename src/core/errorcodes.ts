export interface IErrorContentModel {
  code: number;
  message: string;
}

export type IErrorCodeModel = { [key: string]: IErrorContentModel };

export const ERRORCODES: IErrorCodeModel = {
  /* HTTP Errors 100 - 599 */
  "400": { code: 400, message: "Bad Request" },
  "401": { code: 401, message: "Unauthorized" },
  "402": { code: 402, message: "Payment Required" },
  "403": { code: 403, message: "Forbidden" },
  "404": { code: 404, message: "Not Found" },
  "500": { code: 500, message: "Internal Server Error" },

  /* Application Errors 1000 - 4999 */
  "1000": { code: 1000, message: "Application Error" },

  /* Intergration Errors 5000 - 9999 */
  "5000": { code: 5000, message: "Application Error" },
};

export function getErrorContent(code: number): IErrorContentModel {
  return ERRORCODES[code.toString()];
}
