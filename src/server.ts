import express, { Router, Application } from "express";
import mongoose from "mongoose";
import { json } from "body-parser";
import { TenantsRouter, UsersRouter } from "./routes";
import { logger } from "./core/utils/logger";
const dotenv = require("dotenv");

dotenv.config();
const TRN_DB_CONNECT: string = process.env.TRN_DB_CONNECT ?? '';
const PORT = parseInt(process.env.PORT ?? '8000');
const NODE_ENV = process.env.NODE_ENV;
const DEFAULT_TENANT =  process.env.DEFAULT_TENANT;
const DEFAULT_USER =  process.env.DEFAULT_USER;

logger.forceLog("ENV_VARIABLES", NODE_ENV, PORT, TRN_DB_CONNECT);

const app: Application = express();
app.use(json());
app.use(express.static("public"));

app.use(function(req, res, next) {
  if (!req.headers.authorization) {
    // return res.status(403).json({ error: 'No credentials sent!' });
    req.headers["tenantId"] = DEFAULT_TENANT;
    req.headers["userId"] = DEFAULT_USER;
  } else {
    //TODO: get form claims
    // req.headers["tenantId"] = DEFAULT_TENANT;
    // req.headers["userId"] = DEFAULT_USER;
  }

  next();
});

app.use(TenantsRouter)
.use(UsersRouter)
;

const router = Router();
router.get("/api", async (req, res) => {
  res.send("success");
});
app.use(router);

mongoose
  .connect(TRN_DB_CONNECT, {
  })
  .then(() => {
    logger.forceLog("connected to database");
  })
  .catch((ex) => {
    logger.forceLog("failed to connect database", ex);
  });

app.listen(PORT, () => {
  logger.forceLog(`server is listening on port ${PORT}`);
});
