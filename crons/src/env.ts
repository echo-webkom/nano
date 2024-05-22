export const validateEnv = (env: Record<string, string>) => {
  const keys = ["DATABASE_URL", "ADMIN_KEY"];

  for (const key of keys) {
    if (!env[key]) {
      throw new Error(`Missing env var: ${key}`);
    }
  }
};
