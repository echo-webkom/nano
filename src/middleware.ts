import { MiddlewareHandler } from "hono";
import { Bindings } from "hono/types";

export const auth: MiddlewareHandler<{ Bindings: Bindings }> = async (
  c,
  next
) => {
  if (!c.env.SECRET) {
    return next();
  }

  const token = c.req.header("Authorization");
  if (token !== `Bearer ${c.env.SECRET}`) {
    return c.text("Unauthorized", { status: 401 });
  }

  return next();
};
