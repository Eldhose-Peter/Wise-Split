import { AuthController } from "auth/auth.controller";
import App from "./app";
import UsersController from "users/users.controller";
import { GroupController } from "expense/group.controller";

const app = new App([
  new AuthController(),
  new UsersController(),
  new GroupController(),
]);
app.listen();
