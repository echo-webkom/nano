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
    (match) => htmlEscapes[match as keyof typeof htmlEscapes]
  );
};
