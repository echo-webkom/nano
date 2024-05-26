import * as Striker from "./striker";

export const KEY = "reports";
export const TTL = 60 * 60 * 1; // 1 hour

const REPORTS_UNTIL_STRIKE = 2;

/**
 * Adds a report to the KV store. If the number of reports exceeds the threshold,
 * the "kaffemaskin" will be given a strike.
 *
 * Each report has a TTL of 1 hour.
 *
 * @param kv the KV namespace
 * @param reporter the id of the reporter
 * @returns the current number of strikes
 */
export const add = async (
  kv: KVNamespace,
  reporter: string,
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

/**
 * Gets the current number of reports.
 *
 * @param kv the KV namespace
 * @returns the current number of report
 */
export const get = async (kv: KVNamespace): Promise<number> => {
  return kv.list({ prefix: KEY }).then((keys) => keys.keys.length);
};

/**
 * Resets the number of reports to 0.
 *
 * @param kv the KV namespace
 */
export const reset = async (kv: KVNamespace): Promise<void> => {
  const keys = await kv.list({ prefix: KEY });
  await Promise.all(keys.keys.map((key) => kv.delete(key.name)));
};
