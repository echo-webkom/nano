import { bearerAuth } from "https://deno.land/x/hono@v3.12.11/middleware.ts";
import { MiddlewareHandler } from "https://deno.land/x/hono@v3.12.11/mod.ts";

const AUTH_KEY = Deno.env.get("AUTH_KEY");

export const auth = (): MiddlewareHandler =>
  AUTH_KEY ? bearerAuth({ token: AUTH_KEY }) : async (_, next) => await next();
