import { useEffect, useState } from "react";

import BaseModal from "@ui/BaseModal";
import Button from "@ui/Button";
import UserListItemLoading from "@ui/skeletons/UserSkeletons";
import TextInput from "@ui/TextInput";
import { truncateString } from "@utils/format";
import cn from "classnames";
import { IRoom } from "global/types";
import Image from "next/image";
import { IoSearchOutline } from "react-icons/io5";
import basicFetch from "@utils/basicFetch";

const handleJoinRoom = (room: IRoom) => {
  alert(`Joining room ${room.name}`);
};

const RoomListItem = ({ room, socket }: { room: IRoom; socket: any }) => {
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);

  return (
    <li
      className={cn(
        "group flex items-center cursor-pointer rounded-lg border border-gray-200 justify-between p-4 hover:bg-gray-50 duration-150",
        {
          "border-red-300": room.am_i_blocked, //tmp
        }
      )}
      onClick={() => {
        if (room.am_i_member) return;
        if (room.type === "protected") {
          setShowPasswordModal(true);
        } else {
          socket.emit("joinRoom", {
            roomId: room.id,
          });
        }
      }}
    >
      <div className="flex items-center gap-x-2 justify-between w-full">
        <div className="w-full flex justify-between gap-x-2">
          <div className="ml-2 flex">
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
          <div>
            {room.type === "public" && (
              <span className="text-xs text-green-500 font-semibold"></span>
            )}
            {room.type === "protected" && (
              <span className="text-xs text-red-500 font-semibold">
                Protected
              </span>
            )}
            <button
              className="ml-2 w-12 items-center
            "
            >
              <span className="text-xs text-gray-400 font-semibold">
                {room.am_i_member ? "Joined" : ""}
              </span>
            </button>
          </div>
        </div>
      </div>
      {showPasswordModal && (
        <BaseModal
          title="Enter password"
          onClose={() => setShowPasswordModal(false)}
        >
          <div className="flex flex-col gap-y-4 p-6 justify-center items-center">
            <TextInput
              label={`joining room ${room.name}`}
              name="password"
              placeholder="Password"
              inputClassName="pl-12 py-[8px] "
            />
            <Button
              type="submit"
              className="w-full"
              onClick={() => {
                handleJoinRoom(room);
                setShowPasswordModal(false);
              }}
            >
              Join
            </Button>
          </div>
        </BaseModal>
      )}
    </li>
  );
};
// const fetcher = (url) => fetch(url).then((res) => res.json());
const ExploreRoomsTab = ({ socket }: { socket: any }) => {
  //   const chatCtx = useChatContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldSearch, setShouldSearch] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState([]);
  // const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  var today = new Date();
  const rooms: IRoom[] = [
    {
      id: 1,
      name: "memers",
      description: "This is the first room",
      avatar_url: "/images/default-avatar.jpg",
      type: "public",
      created_at: today,
      am_i_admin: true,
      am_i_member: true,
      am_i_owner: false,
      am_i_pending: false,
      am_i_banned: false,
    },
    {
      id: 2,
      name: "gamers",
      description: "This is the second room",
      avatar_url: "/images/default-avatar.jpg",
      type: "protected",
      created_at: today,
      am_i_admin: false,
      am_i_member: false,
      am_i_owner: false,
      am_i_pending: false,
      am_i_banned: false,
    },
  ];

  // const {
  //   data: searchResults,
  //   error: searchError,
  //   isLoading: searchLoading,
  // } = useSWR(
  //   searchQuery.length > 0 || shouldSearch
  //     ? `/chat/room/explore/${searchQuery}`
  //     : null,
  //   fetcher
  // );
  const getRooms = async (value) => {
    const resp = await basicFetch.get(`/chat/room/explore/${value}`);

    if (resp.status == 200) {
      return await resp.json();
    }
    return [];
  };
  const searchError = false;
  const searchLoading = false;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShouldSearch(false);
  };

  useEffect(() => {
    getRooms("").then((resp) => {
      setSearchResults(resp);
    });
  }, [true]);

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
          onChange={async (e) => {
            setSearchResults(await getRooms(e.target.value));
          }}
          inputClassName="pl-12 py-[8px] "
        />
      </form>

      <ul className="no-scrollbar mt-4 gap-y-1 flex flex-col overflow-y-scroll h-[calc(60vh-160px)] scroll-smooth">
        {!searchError &&
          !searchLoading &&
          searchResults &&
          searchResults?.map((room: IRoom) => (
            <RoomListItem key={room.id} room={room} socket={socket} />
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
