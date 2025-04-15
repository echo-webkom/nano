export const escapehtml = (str: string) => {
  const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return String(str).replace(
    /[&<>"']/g,
    (match) => htmlEscapes[match as keyof typeof htmlEscapes],
  );
};

export const calculateHappeningXp = (
  amount: number,
  cost: number | null,
  type: string,
) => {
  let typeXp = 0
  
  if (type === "event") typeXp = 100;
  if (type === "bedpres") typeXp = 200;
  if (type === "external") typeXp = 100; 

  return Math.floor((amount ** 1.5 / 10 + (cost ? cost: 0) / 5 + typeXp) / 3);
};
