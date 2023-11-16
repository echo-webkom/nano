import { bearerAuth } from "https://deno.land/x/hono@v3.10.1/middleware.ts";
import { MiddlewareHandler } from "https://deno.land/x/hono@v3.9.2/mod.ts";

const SECRET = Deno.env.get("SECRET");

export const auth = (): MiddlewareHandler =>
  SECRET ? bearerAuth({ token: SECRET }) : async (_, next) => await next();
