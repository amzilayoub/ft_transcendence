import { getToken } from "@utils/auth-token";
import { IUser } from "global/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getUserByUsername(
  username: string
): Promise<IUser | null> {
  try {
    const res = await fetch(`${API_URL}/users/${username}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (res.status === 200) {
      return res.json();
    }
    return null;
  } catch (err) {
    return null;
  }
}
