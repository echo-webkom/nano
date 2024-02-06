const kv = await Deno.openKv();

export type Strike = {
  userId: string;
  issuedAt: Date;
};

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

/**
 * Remove all strikes
 */
export async function clearStrikes() {
  const strikes = kv.list<Strike>({
    prefix: ["strike"],
  });

  for await (const strike of strikes) {
    await kv.delete(strike.key);
  }
}
