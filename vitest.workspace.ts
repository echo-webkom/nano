import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "./apps/crons/vitest.config.ts",
  "./apps/echogram/vitest.config.ts",
]);
