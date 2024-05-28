const LOG_LEVELS = {
  info: "INFO",
  error: "ERROR",
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

/**
 * Logger for logging messages to the console. Used
 * to add more context to the logs.
 *
 * @example
 * ```ts
 * Logger.info("Hello, world!");
 * Logger.error("Something went wrong");
 * ```
 */
export class Logger {
  static log = (message: string) => {
    this.print("info", message);
  };

  static info = (message: string) => {
    this.print("info", message);
  };

  static error = (message: string) => {
    this.print("error", message);
  };

  private static print = (level: LogLevel, message: string) => {
    const time = this.getTime();

    console[level](`[${LOG_LEVELS[level]}] [${time}] ${message}`);
  };

  private static getTime = () => {
    const date = new Date();
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");

    return `${hour}:${minute}:${second}`;
  };
}
