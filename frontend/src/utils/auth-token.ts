import isBrowser from "./isBrowser";

export const setToken = (token: string) => {
  if (!isBrowser) return null;
  return localStorage.setItem("auth_token", token);
};

export const getToken = () => {
  if (!isBrowser) return null;
  return localStorage.getItem("auth_token");
};

export const removeToken = () => {
  if (!isBrowser) return null;
  return localStorage.removeItem("auth_token");
};
