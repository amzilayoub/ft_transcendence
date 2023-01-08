import React, { useEffect, useState } from "react";

import Link from "next/link";
import { AiOutlineCode as TmpLogo } from "react-icons/ai";

import ProfileNavMenu from "@components/menus/dropdowns/ProfileNavMenu";
import AuthModal from "@components/modals/AuthModal";
import Searchbar, { SearchbarPopover } from "@components/navbar/SearchBar";
import Button from "@ui/Button";
import { FALLBACK_AVATAR } from "@utils/constants";
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

// temporary
const Logo = ({ ...props }) => (
  <TmpLogo className="w-full h-full text-secondary" {...props} />
);

const Navbar = () => {
  const ctx = useAuthContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState<"login" | "register">(
    "login"
  );
  // rerender when user changes
  useEffect(() => {
    if (ctx?.user) {
      setShowAuthModal(false);
    }
  }, [ctx?.user]);

  return (
    <>
      <nav className="fixed z-20 flex items-center justify-center w-full h-16 py-2 bg-white shadow-sm">
        {/* Normal Screen Width */}
        <ul className="items-center justify-between hidden w-full grid-cols-12 px-3 md:grid xl:max-w-7xl xl:px-0">
          <li className="col-span-2 list-none md:col-span-3">
            <Link href="/">
              <div className="h-16 cursor-pointer w-14">
                <Logo src={""} />
              </div>
            </Link>
          </li>
          <li className="justify-center w-full col-span-3 list-none md:col-span-6 md:flex">
            <Searchbar
              onChange={() => {}}
              onSubmit={() => {}}
              placeholder="Search..."
            />
          </li>

          <li className="flex justify-end col-span-7 list-none gap-x-2 md:col-span-3">
            {ctx?.user || ctx?.loadingUser ? (
              <ProfileNavMenu
                isLoading={ctx?.loadingUser}
                username={ctx?.user?.username || ""}
                first_name={ctx?.user?.first_name || ""}
                last_name={ctx?.user?.last_name || ""}
                avatar_url={ctx?.user?.avatar_url || FALLBACK_AVATAR}
                onLogout={() => ctx?.logout()}
              />
            ) : (
              <>
                <Button
                  onClick={() => {
                    setAuthModalType("login");
                    setShowAuthModal(true);
                  }}
                  variant="secondary"
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    setAuthModalType("register");
                    setShowAuthModal(true);
                  }}
                >
                  Join
                </Button>
              </>
            )}
          </li>
        </ul>
        {/* Mobile Screen Width */}
        <ul className="flex items-center justify-between w-full h-full px-2 md:hidden">
          <li className="list-none">
            <Link href="/">
              <div className="h-16 cursor-pointer w-14">
                <Logo src={""} />
              </div>
            </Link>
          </li>
          <li className="w-full text-right">
            <SearchbarPopover
              onChange={() => {}}
              onSubmit={() => {}}
              placeholder="Search..."
            />
          </li>
          <li className="flex gap-x-2">
            {ctx?.user ? (
              <ProfileNavMenu
                username={ctx?.user?.username}
                first_name={ctx?.user?.first_name}
                last_name={ctx?.user?.last_name}
                avatar_url={ctx?.user?.avatar_url}
                onLogout={() => ctx?.logout()}
                isLoading={ctx?.loadingUser}
              />
            ) : (
              <>
                <Button
                  onClick={() => {
                    setAuthModalType("login");
                    setShowAuthModal(true);
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    setAuthModalType("register");
                    setShowAuthModal(true);
                  }}
                >
                  Join
                </Button>
              </>
            )}
          </li>
        </ul>
      </nav>
      {showAuthModal && (
        <AuthModal
          type={authModalType}
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;
