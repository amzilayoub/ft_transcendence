import { useState } from "react";

import cn from "classnames";
import Image from "next/image";
import { BsVolumeMute } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import useSWR from "swr/immutable";

import UserListItemLoading from "@ui/skeletons/UserSkeletons";
import TextInput from "@ui/TextInput";
import basicFetch from "@utils/basicFetch";
import { fetcher } from "@utils/swr.fetcher";
import { useAuthContext } from "context/auth.context";
import { IUser, PartialWithRequired } from "global/types";

const UserListItem = ({
  user,
}: {
  user: PartialWithRequired<IUser, "username">;
}) => {
  const ctx = useAuthContext();
  const [isMuted, setIsMuted] = useState(false);

  const onMuteClick = () => {
    // setIsMuted(!isMuted);
    basicFetch
      .get(`/users/${user.username}/${isMuted ? "unmute" : "mute"}`)
      .then((res) => {
        if (res.status === 200) setIsMuted(!isMuted);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <li
      onClick={() => {}}
      className="group flex items-center cursor-pointer rounded-lg border border-gray-200 justify-between p-4 hover:bg-gray-50 duration-150"
    >
      <div className="flex items-center gap-x-2 justify-between w-full">
        <div className="w-full flex gap-x-2">
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
        </div>
        {false && (
          <button className="text-xs text-gray-400">Chat with yourself?</button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMuteClick();
          }}
          className={cn(
            "items-center p-2 rounded-full font-semibold text-red-500 gap-x-2 hover:text-red-500 hover:bg-white duration-150",
            {
              flex: isMuted,
              "hidden group-hover:flex": !isMuted,
            }
          )}
        >
          <BsVolumeMute />
        </button>
      </div>
    </li>
  );
};
const SearchPeopleTab = ({}: {}) => {
  //   const chatCtx = useChatContext();
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
    fetcher
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShouldSearch(false);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShouldSearch(true);
        }}
        className="group relative h-10 w-full"
      >
        <label className="absolute top-3 left-3 flex items-center justify-center text-gray-400">
          <button type="submit" className="h-full w-full cursor-default">
            <IoSearchOutline className="group-focus-within:text-secondary group-hover:text-secondary h-6 w-6 text-gray-400" />
          </button>
        </label>
        <TextInput
          name="search"
          placeholder="Search people"
          onChange={(e) => handleSearchChange(e)}
          inputClassName="pl-12 py-[8px] "
        />
      </form>
      <ul className="py-4">
        {!searchError &&
          !searchLoading &&
          searchResults?.map((user: IUser) => (
            <UserListItem key={user.username} user={user} />
          ))}
        {searchLoading &&
          [1, 2, 3, 4, 5].map((i) => <UserListItemLoading key={i} />)}
        {!searchError && searchResults?.length === 0 && (
          <p className="py-10 text-center text-gray-400">No results found</p>
        )}
      </ul>
    </div>
  );
};
export default SearchPeopleTab;
