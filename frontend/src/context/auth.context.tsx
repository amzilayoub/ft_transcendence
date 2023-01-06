import { createContext, useContext, useEffect, useMemo, useState } from "react";

import router from "next/router";

import { getToken, removeToken, setToken } from "@utils/auth-token";
import isBrowser from "@utils/isBrowser";
import { ICurrentUser } from "global/types";

export interface IRegisterPayload {
  email: string;
  password: string;
  username: string;
}

export interface AuthState {
  user: ICurrentUser | null;
  isAuthenticated: boolean;
  loadingUser: boolean;
  loading: boolean;
  error: string | null;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (payload: IRegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

const loadUserData = async () => {
  try {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    });

    if (resp.status === 200) {
      const data = await resp.json();
      //
      return data;
    }
  } catch (error) {
    removeToken();
    router.push("/");
  }
  return null;
};

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<ICurrentUser | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true); // already logged in (token exists)
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const login = async (emailOrUsername: string, password: string) => {
    try {
      setLoading(true);
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            emailOrUsername.includes("@")
              ? { email: emailOrUsername, password }
              : { username: emailOrUsername, password }
          ),
        }
      );

      if (resp.status === 200) {
        setIsAuthenticated(true);
        const data = await resp.json();
        setToken(data.accessToken);
        setLoadingUser(true);
        const userData = await loadUserData();
        setUser(userData);
        setLoadingUser(false);
      } else {
        const data = await resp.json();
        setError(data.message);
      }
    } catch (error) {
      // console.log("EEError", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const register = async (payload: IRegisterPayload) => {
    try {
      setLoading(true);
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (resp.status === 201) {
        setIsAuthenticated(true);
        const data = await resp.json();
        setToken(data.accessToken);
        setLoadingUser(true);
        const userData = await loadUserData();
        setUser(userData);
        setLoadingUser(false);
      } else {
        const data = await resp.json();
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    removeToken();
    window.location.href = "/";

    // try {
    //   const resp = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/auth/signout`,
    //     {
    //       method: "POST",
    //       headers: {
    //         Authorization: "Bearer " + getToken(),
    //       },
    //     }
    //   );

    //   if (resp.status === 200) {
    //     removeToken();
    //     setUser(null);
    //   }
    // } catch (error) {
    //   setError(error.message);
    // }
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      loadingUser,
      loading,
      error,
      login,
      register,
      logout,
    }),
    [user, loadingUser, loading, error, isAuthenticated]
  );

  // console.log("value", value);
  useEffect(() => {
    if (!isBrowser) return;
    if (getToken()) {
      setIsAuthenticated(true); // tmp
      (async () => {
        const data = await loadUserData();
        setUser(data);
        setLoadingUser(false);
      })();
    } else {
      setLoadingUser(false);
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
