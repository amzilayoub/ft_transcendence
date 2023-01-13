import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import router from "next/router";

import basicFetch from "@utils/basicFetch";
import isBrowser from "@utils/isBrowser";
import {
  removeLocalStorage,
  removeUser,
  setLocalStorage,
} from "@utils/local-storage";
import { ICurrentUser } from "global/types";

export interface AuthState {
  user: ICurrentUser | null;
  isAuthenticated: boolean;
  loadingUser: boolean;
  logout: () => void;
  error: string | null;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

const loadUserData = async () => {
  try {
    // const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      credentials: "include",
    });

    if (resp.status === 200) {
      const data = await resp.json();
      //
      return data;
    }
  } catch (error) {
    console.log(error);
    router.push("/");
  }
  return null;
};

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<ICurrentUser | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true); // already logged in (token exists)
  const ref = useRef(false);

  const logout = async () => {
    try {
      const resp = await basicFetch.get(`/auth/logout`);
      if (resp.status === 200) {
        router.push("/");
        removeUser();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      loadingUser,
      logout,
    }),
    [user, loadingUser, isAuthenticated]
  );

  useEffect(() => {
    if (!isBrowser) return;
    if (!user && !ref.current) {
      setLoadingUser(true);
      ref.current = true;
      loadUserData()
        .then((data) => {
          if (data) {
            if (data === null)
              throw new Error("User data is null. Redirecting to /");
            setUser(data);
            setLocalStorage("user", JSON.stringify(data));
            setIsAuthenticated(true);
            if (router.pathname === "/") router.push("/home");
          }
        })
        .catch((error) => {
          console.log(error);
          !isAuthenticated && setIsAuthenticated(false);
          removeLocalStorage("user");
          router.push("/");
        })
        .finally(() => {
          setLoadingUser(false);
        });
    }
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
};

export { AuthContextProvider, useAuthContext };
