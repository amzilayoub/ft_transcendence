import { getToken } from "@utils/auth-token";

interface IData {
  method: string;
  headers: any;
  body?: any;
}

const defaultFetch = (
  uri: string,
  method: string = "POST",
  additionalHeaders: any = {},
  body: any = {}
) => {
  const data: IData = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
      ...additionalHeaders,
    },
  };
  if (method.toLocaleLowerCase() != "get") data["body"] = JSON.stringify(body);
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${uri}`, data);
};

const basicFetch = {
  post: (uri: string, additionalHeaders: any = {}, body: any = {}) => {
    return defaultFetch(uri, "POST", additionalHeaders, body);
  },

  get: (uri: string, additionalHeaders: any = {}) => {
    return defaultFetch(uri, "GET", additionalHeaders, {});
  },
};

export default basicFetch;
