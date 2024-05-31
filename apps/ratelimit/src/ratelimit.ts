export type RateLimitResponse = {
  success: boolean;
  remaning: number;
  max: number;
};

export type RateLimitConfig = {
  max: number;
  time: number;
  whitelist: Array<string>;
  blacklist: Array<string>;
};

export const defaultConfig = {
  max: 100,
  time: 60,
  whitelist: [],
  blacklist: [],
};

export class RateLimit {
  kv: KVNamespace;
  max: number;
  time: number;
  whitelist: Array<string>;
  blacklist: Array<string>;

  constructor(kv: KVNamespace, config?: RateLimitConfig) {
    const { max, time, whitelist, blacklist } = {
      ...defaultConfig,
      ...config,
    };

    this.kv = kv;
    this.max = max;
    this.time = time;
    this.whitelist = whitelist;
    this.blacklist = blacklist;
  }

  check = async (key: string): Promise<RateLimitResponse> => {
    if (this.blacklist.includes(key)) {
      return {
        success: false,
        remaning: 0,
        max: this.max,
      };
    }

    if (this.whitelist.includes(key)) {
      return {
        success: true,
        remaning: this.max,
        max: this.max,
      };
    }

    const curr = await this.get(key);

    if (curr >= this.max) {
      return {
        success: false,
        remaning: 0,
        max: this.max,
      };
    }

    const count = await this.increment(key);

    return {
      success: true,
      remaning: this.max - count,
      max: this.max,
    };
  };

  increment = async (key: string): Promise<number> => {
    const count = await this.get(key);
    await this.kv.put(key, String(count + 1));
    return count + 1;
  };

  get = async (key: string): Promise<number> => {
    const value = await this.kv.get(key);

    if (value === null) {
      return 0;
    }

    return Number(value);
  };
}
