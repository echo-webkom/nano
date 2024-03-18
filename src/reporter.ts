import * as Striker from "./striker";

export const KEY = "reports";
export const TTL = 60 * 60 * 1; // 1 hour

const REPORTS_UNTIL_STRIKE = 2;

export const add = async (
  kv: KVNamespace,
  reporter: string
): Promise<number> => {
  const expiration = Date.now() / 1000 + TTL;
  await kv.put(`${KEY}:${Date.now()}`, reporter, { expiration });

  const totalReports = await get(kv);
  if (totalReports >= REPORTS_UNTIL_STRIKE) {
    await Striker.add(kv);
    await reset(kv);
  }

  return Striker.get(kv);
};

export const get = async (kv: KVNamespace): Promise<number> => {
  return kv.list({ prefix: KEY }).then((keys) => keys.keys.length);
};

export const reset = async (kv: KVNamespace): Promise<void> => {
  const keys = await kv.list({ prefix: KEY });
  await Promise.all(keys.keys.map((key) => kv.delete(key.name)));
};
