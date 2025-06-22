import { config } from "dotenv";
import { cleanEnv, port, str, url } from "envalid";

config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "production", "test"],
    default: "development",
  }),
  DATABASE_URL: str(),

  PORT: port({ default: 5000 }),

  JWT_SECRET: str(),
  FRONTEND_URL: url(),
});
