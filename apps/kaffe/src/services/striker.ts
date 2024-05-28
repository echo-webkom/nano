export const KEY = "strikes";
export const TTL = 60 * 60 * 24 * 7; // 7 days

/**
 * Gets the current number of strikes.
 *
 * @param kv the KV namespace
 * @returns the current number of strikes
 */
export const get = async (kv: KVNamespace): Promise<number> => {
  return kv.list({ prefix: KEY }).then((keys) => keys.keys.length);
};

/**
 * Adds a strike to the KV store. Each strike has a TTL of 7 days.
 *
 * @param kv the KV namespace
 * @returns the current number of strikes
 */
export const add = async (kv: KVNamespace): Promise<number> => {
  const expiration = Date.now() / 1000 + TTL;
  await kv.put(`${KEY}:${Date.now()}`, "", { expiration });

  return get(kv);
};

/**
 * Resets the number of strikes to 0.
 *
 * @param kv the KV namespace
 */
export const reset = async (kv: KVNamespace): Promise<void> => {
  const keys = await kv.list({ prefix: KEY });
  await Promise.all(keys.keys.map((key) => kv.delete(key.name)));
};
