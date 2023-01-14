interface IData {
  method: string;
  credentials: RequestCredentials;
  headers: any;
  body?: any;
}

const defaultFetch = (
  uri: string,
  method: string = "POST",
  additionalHeaders: any = {},
  body: any = {}
) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  console.log(params.token);
  const data: IData = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      //   Authorization: "Bearer " + params.token, // not needed for now, using cookies.
      ...additionalHeaders,
    },
  };
  const url = `${process.env.NEXT_PUBLIC_API_URL}${uri}`.replace(
    /(?<!:)\/+/gm,
    "/"
  );

  if (method.toLocaleLowerCase() != "get") data["body"] = JSON.stringify(body);
  return fetch(url, data);
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
