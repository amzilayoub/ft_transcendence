import React from "react";

import Link from "next/link";
import { AiOutlineCode as TmpLogo } from "react-icons/ai";

import ProfileNavMenu from "@components/menus/dropdowns/ProfileNavMenu";
import Searchbar, { SearchbarPopover } from "@components/navbar/SearchBar";
import Button from "@ui/Button";

export interface IUserData {
  id: string;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

const sampleUser: IUserData = {
  username: "joe",
  firstName: "Joe",
  lastName: "Doe",
  avatarUrl:
    "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
  id: "3142kjn2k",
  middleName: "lorem",
  email: "joe@gmail.com",
  createdAt: "",
  updatedAt: "",
};

// temporary
const Logo = ({ ...props }) => (
  <TmpLogo className="text-secondary h-full w-full" {...props} />
);

const Navbar = () => {
  // const [isOpen, setIsOpen] = useState(false);
  // const { width } = useWindowSize();

  // useEffect(() => {
  //   if (width > 640) setIsOpen(false);
  // }, [width]);
  return (
    <nav className="fixed z-20 flex h-16 w-full items-center justify-center bg-white py-2 shadow-sm">
      {/* Normal Screen Width */}
      <ul className="hidden w-full grid-cols-12 items-center justify-between px-3 md:grid xl:max-w-7xl xl:px-0">
        <li className="col-span-2 list-none md:col-span-3">
          <Link href="/">
            <div className="h-16 w-14 cursor-pointer">
              <Logo src={""} />
            </div>
          </Link>
        </li>
        <li className="col-span-3 w-full list-none justify-center md:col-span-6 md:flex">
          <Searchbar
            onChange={() => {}}
            onSubmit={() => {}}
            placeholder="Search..."
          />
        </li>

        <li className="col-span-7 flex list-none justify-end gap-x-2 md:col-span-3">
          {true ? (
            <ProfileNavMenu
              username={sampleUser?.username}
              firstName={sampleUser?.firstName}
              lastName={sampleUser?.lastName}
              avatarUrl={sampleUser?.avatarUrl}
              onLogout={() => {}}
            />
          ) : (
            <>
              <Button onClick={() => {}} variant="secondary">
                Login
              </Button>
              <Button onClick={() => {}}>Join</Button>
            </>
          )}
        </li>
      </ul>
      {/* Mobile Screen Width */}
      <ul className="flex h-full w-full items-center justify-between px-2 md:hidden">
        <li className="list-none">
          <Link href="/">
            <div className="h-16 w-14 cursor-pointer">
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
          {true ? (
            <ProfileNavMenu
              username={sampleUser?.username}
              firstName={sampleUser?.firstName}
              lastName={sampleUser?.lastName}
              avatarUrl={sampleUser?.avatarUrl}
              onLogout={() => {}}
            />
          ) : (
            <>
              <Button onClick={() => {}} variant="secondary">
                Login
              </Button>
              <Button onClick={() => {}}>Join</Button>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
