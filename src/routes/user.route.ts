import { RESTRouteBuilder } from "../core/routes/base.route";
import { UserController } from "../controllers/";

const ROUTE_PREFIX = "/api/users";

const userOps = new UserController();

const opsRouteBuilder = new RESTRouteBuilder(ROUTE_PREFIX, userOps);

// add mroe routes
// add regoster route
opsRouteBuilder.router.post(`${ROUTE_PREFIX}/register`, async (req, res) => {
  opsRouteBuilder.assertAndSetClaims(req);
  const registredUser = await userOps.register(req.body);
  return res.status(200).send(registredUser);
});

const router = opsRouteBuilder.buildCRUDRoutes();

export { router as UsersRouter };
