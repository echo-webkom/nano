import { Hono } from "hono";
import { auth } from "./middleware";

export type Bindings = {
  SECRET: string;
  R2: R2Bucket;
  ADMIN_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/:id", async (c) => {
  const { id } = c.req.param();

  const object = await c.env.R2.get(id);

  if (!object) {
    c.status(404);
    return c.json({ message: "Not found" });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.etag);

  return new Response(object.body, {
    headers,
  });
});

const SUPPORTED_FILE_TYPES = ["image/png", "image/jpeg", "image/gif"];

app.post("/:id", auth, async (c) => {
  const { id } = c.req.param();

  const formData = await c.req.formData();

  const file = formData.get("file") as File;

  if (!file || !file.size || !SUPPORTED_FILE_TYPES.includes(file.type)) {
    c.status(400);
    return c.json({ message: "No file uploaded" });
  }

  const body = await file.arrayBuffer();

  await c.env.R2.put(id, body);

  return c.json({
    message: "File uploaded",
  });
});

app.delete("/:id", auth, async (c) => {
  const { id } = c.req.param();

  await c.env.R2.delete(id);

  return c.json({
    message: "File deleted",
  });
});

export default app;
