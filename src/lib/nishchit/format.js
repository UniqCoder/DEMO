export const mono = (value, digits = 2) =>
  Number(value).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const monoInt = (value) => Number(value).toLocaleString("en-US");

export const pct = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;

export const clock = (totalMinutes) => {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const hash = (n) =>
  "0x" + Math.abs(n).toString(16).padStart(4, "0").slice(0, 4) + "…" ;