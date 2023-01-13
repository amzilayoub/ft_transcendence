import isBrowser from "./isBrowser";

export const setLocalStorage = (key: string, value: string) => {
  if (!isBrowser) return null;
  return localStorage.setItem(key, value);
};

export const getLocalStorage = (key: string) => {
  if (!isBrowser) return null;
  return localStorage.getItem(key);
};

export const removeLocalStorage = (key: string) => {
  if (!isBrowser) return null;
  return localStorage.removeItem(key);
};

export const removeUser = () => {
  if (!isBrowser) return null;
  return localStorage.removeItem("user");
};
