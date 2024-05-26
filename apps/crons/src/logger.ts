const getTime = () => {
  const date = new Date();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");

  return `${hour}:${minute}:${second}`;
};

export const log = (message: string) => {
  const type = "INFO";
  const time = getTime();

  console.log(`[${type}] [${time}] ${message}`);
};
