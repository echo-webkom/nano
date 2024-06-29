import type { MiddlewareHandler } from "hono";
import type { Bindings } from "hono/types";

/**
 * Check if the request authorization header matches the secret
 *
 * @param c hono context
 * @param next next handler
 * @returns the next handler
 */
export const auth: MiddlewareHandler<{ Bindings: Bindings }> = async (
  c,
  next
) => {
  // If there is no secret, just run the next handler
  // We assume this is a local development environment
  if (!c.env.ADMIN_KEY) {
    return next();
  }

  const token = c.req.header("Authorization");
  if (token !== `Bearer ${c.env.ADMIN_KEY}`) {
    return c.text("Unauthorized", { status: 401 });
  }

  return next();
};
