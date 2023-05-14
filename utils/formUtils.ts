import { getConvertedBENumber } from "./numberUtils";

// removes leading 0
export const cleanNumber = (s: string) => {
  const res = s.replace(/^0+/, "");
  if (res === "") {
    return "0";
  }
  return res;
};

export const validateString = (s: string) => {
  if (s.trim().length === 0) {
    return false;
  }
  return true;
};

export const validateNumber = (s: string) => {
  const maybeNumber = Number(s);
  if (isNaN(maybeNumber)) {
    return false;
  }
  if (maybeNumber < 0) {
    return false;
  }
  return true;
};

export const getStringInputFromBENumber = (n: number | undefined) => {
  if (!n) {
    return undefined;
  }
  return String(getConvertedBENumber(n));
};
