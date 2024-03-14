import { type MiddlewareHandler, bearerAuth } from "../deps.ts";

const AUTH_KEY = Deno.env.get("AUTH_KEY");

export const auth = (): MiddlewareHandler =>
  AUTH_KEY ? bearerAuth({ token: AUTH_KEY }) : async (_, next) => await next();
