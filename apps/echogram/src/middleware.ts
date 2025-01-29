import { createMiddleware } from "hono/factory";

export const auth = () => {
  return createMiddleware(async (c, next) => {
    if (!c.env.ADMIN_KEY) {
      return await next();
    }

    const token = c.req.header("Authorization");
    if (token !== `Bearer ${c.env.ADMIN_KEY}`) {
      return c.text("Unauthorized", { status: 401 });
    }

    return await next();
  });
};
