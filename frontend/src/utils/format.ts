export const truncateString = (str: string, num: number) => {
  if (!str) return "";
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};

export const getOrdinal = (n: number) => {
  if (n <= 0) return "";
  if (n % 10 == 1 && n % 100 != 11) return "st";
  else if (n % 10 == 2 && n % 100 != 12) return "nd";
  else if (n % 10 == 3 && n % 100 != 13) return "rd";
  return "th";
};
