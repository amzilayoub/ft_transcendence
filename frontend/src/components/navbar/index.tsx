import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

import ProfileNavMenu from "@components/menus/dropdowns/ProfileNavMenu";
import Searchbar, { SearchbarPopover } from "@components/navbar/SearchBar";
import { FALLBACK_AVATAR } from "@utils/constants";
import { fetcher } from "@utils/swr.fetcher";
import { useAuthContext } from "context/auth.context";

export interface IUserData {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

const Navbar = () => {
  const ctx = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldSearch, setShouldSearch] = useState<boolean>(false);

  const {
    data: searchResults,
    error: searchError,
    isLoading: searchLoading,
  } = useSWR(
    searchQuery.length > 0 || shouldSearch
      ? `/users/search/${searchQuery}`
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="fixed z-40 flex h-16 w-full items-center justify-center bg-white py-2 shadow-sm">
      {/* Normal Screen Width */}
      <ul className="hidden w-full grid-cols-12 items-center justify-between px-3 md:grid xl:max-w-7xl xl:px-0">
        <li className="col-span-2 list-none md:col-span-3">
          <Link href="/home">
            <div className="h-16 w-14 cursor-pointer">
              <Image
                src="/ping-pong-logo.png"
                alt="Ping Pong Logo"
                width={100}
                height={100}
                className="h-full w-full"
              />
            </div>
          </Link>
        </li>
        <li className="col-span-3 w-full list-none justify-center md:col-span-6 md:flex">
          {(ctx?.user || ctx?.loadingUser) && (
            <Searchbar
              searchResults={searchResults || []}
              onChange={handleSearchChange}
              onSubmit={() => setShouldSearch(true)}
              searchLoading={searchLoading && searchQuery.length > 0}
              searchError={searchError}
              placeholder="Search..."
            />
          )}
        </li>

        <li className="col-span-7 flex list-none justify-end gap-x-2 md:col-span-3">
          {(ctx?.user || ctx?.loadingUser) && (
            <ProfileNavMenu
              isLoading={ctx?.loadingUser}
              username={ctx?.user?.username || ""}
              first_name={ctx?.user?.first_name || ""}
              last_name={ctx?.user?.last_name || ""}
              avatar_url={ctx?.user?.avatar_url || FALLBACK_AVATAR}
              onLogout={() => ctx?.logout()}
            />
          )}
        </li>
      </ul>
      {/* Mobile Screen Width */}
      <ul className="flex h-full w-full items-center justify-between px-2 md:hidden">
        <li className="list-none">
          <Link href="/home">
            <div className="h-16 w-14 cursor-pointer">
              <Image
                src="/ping-pong-logo.png"
                alt="Ping Pong Logo"
                width={100}
                height={100}
                className="h-full w-full"
              />
              {/* <Logo src={""} /> */}
            </div>
          </Link>
        </li>
        <li className="w-full text-right">
          <SearchbarPopover
            searchResults={searchResults || []}
            onChange={handleSearchChange}
            onSubmit={() => setShouldSearch(true)}
            placeholder="Search..."
            searchLoading={searchLoading && searchQuery.length > 0}
          />
        </li>
        <li className="flex gap-x-2">
          {ctx?.user && (
            <ProfileNavMenu
              username={ctx?.user?.username}
              first_name={ctx?.user?.first_name}
              last_name={ctx?.user?.last_name}
              avatar_url={ctx?.user?.avatar_url}
              onLogout={() => ctx?.logout()}
              isLoading={ctx?.loadingUser}
            />
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
