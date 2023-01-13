import basicFetch from "@utils/basicFetch";
import { IUser } from "global/types";

export async function getUserByUsername(
  username: string
): Promise<IUser | null> {
  try {
    const res = await basicFetch.get(`/users/${username}`);
    if (res.status === 200) {
      return res.json();
    }
    return null;
  } catch (err) {
    return null;
  }
}
