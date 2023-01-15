import { Fragment, useEffect, useState } from "react";

import { Popover, Transition } from "@headlessui/react";
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { IoSearch, IoSearchOutline } from "react-icons/io5";

import useClick from "@hooks/useClick";
import Button from "@ui/Button";
import basicFetch from "@utils/basicFetch";
import { useAuthContext } from "context/auth.context";
import { IUser, PartialWithRequired } from "global/types";

interface SearchbarProps {
  searchResults: any[];
  searchLoading: boolean;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const UserListItem = ({
  user,
}: {
  user: PartialWithRequired<IUser, "username">;
}) => {
  const ctx = useAuthContext();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowUnfollow = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const url = isFollowing ? "/users/unfollow" : "/users/follow";
      const res = await basicFetch.get(url + `/${user.username}`);
      if (!res.ok) {
        throw new Error("Error following user");
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      if (isLoading) return;
      try {
        const res = await basicFetch.get("/users/follows/" + user.username);
        if (!res.ok) {
          throw new Error("Error checking if following");
        }
        setIsFollowing(true);
      } catch (error) {
        console.error(error);
        setIsFollowing(false);
      }
    })();
  }, [user.username, isLoading]);

  return (
    <li className="flex items-center justify-between p-4 hover:bg-gray-100 ">
      <div className="flex items-center gap-x-2 justify-between w-full">
        <Link href={`/u/${user.username}`} className="w-full flex gap-x-2">
          <Image
            src={user.avatar_url || "/images/default-avatar.jpg"}
            alt={(user.first_name || user.username) + " avatar"}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="ml-2">
            <p className="text-sm font-medium">{`${user.first_name} ${user.last_name}`}</p>
            <p className="text-xs text-gray-400">@{user.username}</p>
          </div>
        </Link>
        {
          // is it me?
          user.username && user.username !== ctx?.user?.username && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleFollowUnfollow();
              }}
              isLoading={isLoading}
              className={cn("group/following hover:bg-primary/80", {
                "hover/following:bg-red-600 shadow-lg": isFollowing,
              })}
            >
              <>
                {isFollowing ? (
                  <>
                    <span className="group-hover/following:block hidden  text-sm font-medium">
                      Unfollow
                    </span>
                    <span className="group-hover/following:hidden text-sm font-medium  ml-2 block">
                      Following
                    </span>
                  </>
                ) : (
                  <span className="group-following:hidden text-sm font-medium">
                    Follow
                  </span>
                )}
              </>
            </Button>
          )
        }
      </div>
    </li>
  );
};

const Searchbar = (props: SearchbarProps) => {
  const [showResults, setShowResults] = useState(false);
  const [hasInput, setHasInput] = useState(false);
  useClick(() => {
    setShowResults(false);
  });

  useEffect(() => {}, [hasInput]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(e);
        setShowResults(props.searchResults.length > 0);
      }}
      className="group relative h-10 w-full max-w-lg"
    >
      <label className="absolute top-2 left-3 flex items-center justify-center text-gray-400">
        <button type="submit" className="h-full w-full cursor-default">
          <IoSearchOutline className="group-focus-within:text-secondary group-hover:text-secondary h-6  w-6 text-gray-400" />
        </button>
      </label>
      <input
        type="search"
        className={cn(
          "border focus:border-none h-full w-full rounded-xl py-2 pl-12 text-gray-500 list-none duration-150 outline-none focus-within:outline-primary/60",
          {
            "pr-3": hasInput,
            "rounded-b-none": showResults && props.searchResults.length > 0,
            "focus-within:outline-primary/60": !(
              showResults && props.searchResults.length > 0
            ),
          }
        )}
        placeholder={props.placeholder}
        spellCheck="false"
        onChange={(e) => {
          setHasInput(e.target.value.length > 0);
          props.onChange(e);
        }}
      />
      {props.searchLoading && (
        <div className="bg-white rounded-b-xl hover:rounded-b-xl shadow-xl border-secondary">
          <div className="flex items-center justify-center h-10">
            <p>
              Loading <span className="animate-ping">...</span>
            </p>
          </div>
        </div>
      )}

      {!props.searchLoading && showResults && (
        <ul
          className={cn(
            "bg-white rounded-b-xl hover:rounded-b-xl shadow-xl border-secondary",
            {
              "focus-within:outline-primary/60":
                showResults && props.searchResults.length > 0,
            }
          )}
        >
          {props.searchResults.map((result) => (
            <UserListItem key={result.id} user={result} />
          ))}
        </ul>
      )}
    </form>
  );
};

export const SearchbarPopover = (props: SearchbarProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  if (!isHydrated) {
    return null;
  }

  return (
    <div className="flex w-full justify-end px-2">
      <Popover className="relative w-full">
        {({ open }: { open: boolean }) => (
          <>
            <Popover.Button
              className={`
                ${
                  open
                    ? "ring-secondary"
                    : "text-secondary/70 ring-secondary/70"
                }
                group text-secondary hover:text-secondary hover:ring-secondary inline-flex items-center rounded-full bg-white p-3 text-base font-medium ring-1 focus:outline-none`}
            >
              <IoSearch
                className={`${open ? "" : "text-secondary/70"}
                   group-hover:text-secondary h-5 w-5 transition duration-150 ease-in-out`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-40 mt-2 w-full rounded-xl shadow-xl">
                <Searchbar {...props} />
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default Searchbar;
