import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "./apps/crons/vitest.config.ts",
  "./apps/kaffe/vitest.config.ts",
  "./apps/echogram/vitest.config.ts",
  "./apps/boomtown/vitest.config.ts",
]);
