import express, { Application } from "express";
import mongoose from "mongoose";
import { json } from "body-parser";
import { logger } from "./core/utils/logger";
import { TodoRouter } from "./routes/todo.route";
import { TenantsRouter, UsersRouter } from "./routes";
const dotenv = require("dotenv");

dotenv.config();
const TRN_DB_CONNECT: string = process.env.TRN_DB_CONNECT ?? "";
const PORT = parseInt(process.env.PORT ?? "8000");

const app: Application = express();
app.use(json());
app.use(express.static("public"));

app.use(function (req, res, next) {
  req.headers["tenantId"] = "";
  req.headers["userId"] = "";
  if (!req.headers.authorization) {
  } else {
  }

  next();
});

app.use(TodoRouter());

mongoose
  .connect(TRN_DB_CONNECT, {})
  .then(() => {
    logger.forceLog("connected to database");
  })
  .catch((ex) => {
    logger.forceLog("failed to connect database", ex);
  });

app.listen(PORT, () => {
  logger.forceLog(`server is listening on port ${PORT}`);
});
