import { app } from "./app.ts";

if (import.meta.main) {
  Deno.serve(app.fetch);
}
