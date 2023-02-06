import { Fragment, useEffect, useState } from "react";

import { Popover, Transition } from "@headlessui/react";
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { IoSearch, IoSearchOutline } from "react-icons/io5";

import useClick from "@hooks/useClick";
import Button from "@ui/Button";
import UserListItemLoading from "@ui/skeletons/UserSkeletons";
import basicFetch from "@utils/basicFetch";
import { useAuthContext } from "context/auth.context";
import { IUser, PartialWithRequired } from "global/types";

interface SearchbarProps {
  searchResults: any[];
  searchLoading: boolean;
  searchError?: string | undefined;
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
  const [
    followState, setFollowState,
  ] = useState<"following" | "not-following" | "loading">(
    "loading",
  );

  const handleFollowUnfollow = async () => {
    if (!user) return;
    const resp = await basicFetch.get(`/users/${
      followState === "following" ? "unfollow" : "follow"
    }/${user.username}`);
    if (resp.ok) {
      setFollowState((prev) => (prev === "following" ? "not-following" : "following"));
    }
  };

  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchFollowState = async () => {
      const resp = await basicFetch.get(`/users/follows/${user.username}`);
      if (resp.status === 200) {
        setFollowState("following");
      } else {
        setFollowState("not-following");
      }
    };
    fetchFollowState();
  }, [user]);

  return (
    <li className="flex items-center justify-between p-4 hover:bg-gray-100">
      <div className="flex w-full items-center justify-between gap-x-2">
        <Link href={`/u/${user.username}`} className="flex w-full gap-x-2">
          <Image
            src={user.avatar_url || "/images/default-avatar.png"}
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
                {
                  followState === "following" ? (
                    <span className="text-sm font-medium">
                      Unfollow
                    </span>
                  ) : followState === "not-following" ? (
                    <span className="text-sm font-medium">
                      Follow
                    </span>
                  ) : (
                    <span className="text-sm font-medium">
                      Loading
                    </span>
                  )
                  
                }
            </Button>
          )
        }
      </div>
    </li>
  );
};

const Searchbar = (props: SearchbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  useClick(() => {
    setShowResults(false);
  });

  useEffect(() => {
    setShowResults(
      !!(
        props.searchResults.length > 0 ||
        props.searchLoading ||
        props.searchError
      ) && searchQuery !== ""
    );
  }, [
    props.searchResults,
    props.searchLoading,
    props.searchError,
    searchQuery,
  ]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(e);
        // setShowResults(props.searchResults.length > 0);
      }}
      className={cn("group z-40 relative h-10 w-full max-w-lg")}
    >
      <label className="absolute top-2 left-3 flex items-center justify-center text-gray-400">
        <button type="submit" className="h-full w-full cursor-default">
          <IoSearchOutline className="h-6 w-6 text-gray-400 group-focus-within:text-secondary group-hover:text-secondary" />
        </button>
      </label>
      <input
        tabIndex={0}
        type="search"
        className={cn(
          "border z-50 h-full w-full rounded-xl py-2 pl-12 text-gray-500 list-none duration-150 outline-none",
          {
            "rounded-b-none pr-3": searchQuery !== "",
          }
        )}
        placeholder={props.placeholder}
        spellCheck="false"
        onChange={(e) => {
          setSearchQuery(e.target.value);
          props.onChange(e);
        }}
      />
      {searchQuery !== "" && (
        <div className="z-10 rounded-b-xl border border-t-0 bg-white py-2 shadow-xl">
          {props.searchLoading && (
            <ul className="flex w-full flex-col gap-y-2 px-2">
              {[...new Array(6)].map((i) => (
                <li key={i} className=" w-full border-b py-1">
                  <UserListItemLoading />
                </li>
              ))}
            </ul>
          )}

          {searchQuery !== "" && !props.searchError && !props.searchLoading && (
            <div className="flex items-center justify-center">
              {props.searchResults?.length > 0 ? (
                <ul className="w-full">
                  {props.searchResults.map((result) => (
                    <li key={result.id}>
                      <UserListItem key={result.id} user={result} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="flex flex-col p-10 text-center text-gray-400">
                  <span>No results found for </span>
                  <span className="break-all font-bold">{`"${searchQuery}"`}</span>
                </p>
              )}
            </div>
          )}
        </div>
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
                group inline-flex items-center rounded-full bg-white p-3 text-base font-medium text-secondary ring-1 hover:text-secondary hover:ring-secondary focus:outline-none`}
            >
              <IoSearch
                className={`${open ? "" : "text-secondary/70"}
                   h-5 w-5 transition duration-150 ease-in-out group-hover:text-secondary`}
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
