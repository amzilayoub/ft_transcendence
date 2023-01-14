/**
 * @param url - The URL to fetch
 * @returns The response data if the response was successful, otherwise null
 */
export async function fetcher(url: string): Promise<any> {
  const _url = `${process.env.NEXT_PUBLIC_API_URL}/${url}`.replace(
    /(?<!:)\/+/gm,
    "/"
  );

  const res = await fetch(_url, {
    method: "GET",
    credentials: "include",
  });

  if (res.headers.get("content-type")?.indexOf("application/json") !== -1) {
    const json = await res.json();
    if (res.ok) {
      return json;
    }
  }
  return null;
}
