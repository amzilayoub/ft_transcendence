import { useState } from "react";

import cn from "classnames";
import Image from "next/image";
import { IoSearchOutline } from "react-icons/io5";
import useSWR from "swr/immutable";

import UserListItemLoading from "@ui/skeletons/UserSkeletons";
import TextInput from "@ui/TextInput";
import { truncateString } from "@utils/format";
import { fetcher } from "@utils/swr.fetcher";
import { IRoom } from "global/types";

const RoomListItem = ({ room }: { room: IRoom }) => {
  return (
    <li
      onClick={() => {}}
      className={cn(
        "group flex items-center cursor-pointer rounded-lg border border-gray-200 justify-between p-4 hover:bg-gray-50 duration-150",
        {
          "border-red-300": room.am_i_blocked, //tmp
        }
      )}
    >
      <div className="flex items-center gap-x-2 justify-between w-full">
        <div className="w-full flex gap-x-2">
          <Image
            src={room.avatar_url || "/images/default-avatar.jpg"}
            alt={room.name + " avatar"}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="ml-2">
            <p className="text-sm font-medium">{room.name}</p>
            <p className="text-xs text-gray-400 text-ellipsis">
              {truncateString(room.description, 20)}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};
const ExploreRoomsTab = ({}: {}) => {
  //   const chatCtx = useChatContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldSearch, setShouldSearch] = useState<boolean>(false);

  const {
    data: searchResults,
    error: searchError,
    isLoading: searchLoading,
  } = useSWR(
    searchQuery.length > 0 || shouldSearch
      ? `/chat/room/explore/${searchQuery}`
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
          placeholder="Search rooms"
          onChange={(e) => handleSearchChange(e)}
          inputClassName="pl-12 py-[8px] "
        />
      </form>

      <ul className="no-scrollbar mt-4 gap-y-1 flex flex-col overflow-y-scroll h-[calc(60vh-160px)] scroll-smooth">
        {!searchError &&
          !searchLoading &&
          searchResults &&
          searchResults?.map((room: IRoom) => (
            <RoomListItem key={room.id} room={room} />
          ))}

        {searchLoading &&
          [...new Array(6)].map((i) => <UserListItemLoading key={i} />)}
        {!searchError && searchResults?.length === 0 && (
          <p className="py-10 text-center text-gray-400">No results found</p>
        )}
      </ul>
    </div>
  );
};
export default ExploreRoomsTab;
