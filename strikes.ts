import { Strike } from "./model.ts";
import { kv } from "./kv.ts";

/**
 * Get amount of strikes
 * @returns Amount of strikes
 */
export async function getAmountOfStrikes() {
  const strikes = kv.list<Strike>({
    prefix: ["strike"],
  });

  let amount = 0;
  for await (const _ of strikes) amount++;

  return amount;
}

/**
 * Add a strike to the kitchen
 * @param userId the user that issued the strike
 */
export async function addStrike(userId: string) {
  try {
    const expireIn = 1000 * 60 * 60 * 24 * 7;

    const strike: Strike = {
      userId,
      issuedAt: new Date(),
    };

    const res = await kv.set(["strike", crypto.randomUUID()], strike, {
      expireIn,
    });

    return res.ok;
  } catch {
    return false;
  }
}
