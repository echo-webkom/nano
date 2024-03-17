export const KEY = "strikes";
export const TTL = 60 * 60 * 24 * 7; // 7 days

export const get = async (kv: KVNamespace): Promise<number> => {
  return Number(await kv.get(KEY));
};

export const increment = async (kv: KVNamespace): Promise<number> => {
  const current = await get(kv);
  const updated = current + 1;
  const expiration = Date.now() / 1000 + TTL;

  await kv.put(KEY, `${updated}`, { expiration });

  return updated;
};

export const reset = async (kv: KVNamespace): Promise<void> => {
  await kv.delete(KEY);
};
