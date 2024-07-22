const dotenv = require("dotenv");
import express, { Application } from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import { json } from "body-parser";
import { logger } from "./core/utils/logger";
import {
  TodoRoute,
  UserRoute,
  TenantRoute,
  KeychainRoute,
} from "./routes";
import {
  KeychainController,
  TenantController,
  TodoController,
  UserController
} from "./controllers";
import {
  KeychainCollection,
  TenantCollection,
  TodoCollection,
  UserCollection
} from "./mongo";

// Application router setup
function buildApplicationRoutes(app: Application) {
  app
    .use(new TodoRoute(new TodoController(new TodoCollection())).router)
    .use(new KeychainRoute(new KeychainController(new KeychainCollection())).router)
    .use(new UserRoute(new UserController(new UserCollection())).router)
    .use(new TenantRoute(new TenantController(new TenantCollection())).router);
}

dotenv.config();
const TRN_DB_CONNECT: string = process.env.TRN_DB_CONNECT ?? "";
const PORT = parseInt(process.env.PORT ?? "8000");

// Modularize router setup
function setupRoutes(app: Application) {
  app.use(json());
  app.use(morgan("tiny"));
  app.use(express.static("public"));

  app.use(
    "/swagger",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: "/swagger.json",
      },
    })
  );

  //Middlwware
  app.use(function (req, res, next) {
    if (!req.headers.authorization) {
      // return res.status(403).json({ error: 'No credentials sent!' });
      // req.headers["tenantId"] = DEFAULT_TENANT;
      // req.headers["userId"] = DEFAULT_USER;
    } else {
      //TODO: get form claims
      // req.headers["tenantId"] = DEFAULT_TENANT;
      // req.headers["userId"] = DEFAULT_USER;
    }

    next();
  });

  buildApplicationRoutes(app);
}

async function connectToDatabase() {
  try {
    await mongoose.connect(
      TRN_DB_CONNECT
      //   , {
      //   useNewUrlParser: true,
      //   useCreateIndex: true,
      //   useUnifiedTopology: true,
      // }
    );
    logger.forceLog("connected to database");
  } catch (ex) {
    logger.forceLog("failed to connect database", ex);
    throw ex; // Rethrow or handle as needed
  }
}

async function startServer() {
  try {
    await connectToDatabase();
    const app = express();
    setupRoutes(app);
    app.listen(PORT, () => {
      logger.forceLog(`server is listening on port ${PORT}`);
    });
  } catch (error) {
    logger.forceLog("Error starting the server", error);
  }
}

startServer();
