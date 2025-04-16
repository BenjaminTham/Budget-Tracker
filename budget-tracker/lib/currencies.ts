export const Currencies = [
  { value: "USD", label: "$ USD", locale: "en-US" },
  { value: "SGD", label: "$ SGD", locale: "en-SG" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
];

export type Currency = (typeof Currencies)[0];
