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

export const isURL = (text: string) => {
  var httpUrlRegex =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
  var urlRegex =
    /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
  return urlRegex.test(text) || httpUrlRegex.test(text);
};

// export const urlify = (text: string) => {
//   var urlRegex = /(https?:\/\/[^\s]+)/g;
//   return text.replace(urlRegex, function(url) {
//     return '<a href="' + url + '" target="_blank">' + url + '</a>';
//   })
// }
