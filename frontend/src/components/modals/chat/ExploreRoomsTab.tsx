import { useEffect, useState } from "react";

import cn from "classnames";
import Image from "next/image";
import { IoSearchOutline } from "react-icons/io5";

import BaseModal from "@ui/BaseModal";
import Button from "@ui/Button";
import UserListItemLoading from "@ui/skeletons/UserSkeletons";
import TextInput from "@ui/TextInput";
import basicFetch from "@utils/basicFetch";
import { truncateString } from "@utils/format";
import { IRoom } from "global/types";

const RoomListItem = ({
  room,
  socket,
  onJoinRoom,
}: {
  room: IRoom;
  socket: any;
  onJoinRoom: () => void;
}) => {
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordIsCoorect, setPasswordIsCorrect] = useState(true);
  const [roomPassword, setRoomPassword] = useState("");

  const handleJoinRoom = async () => {
    await joinRoom();
  };

  const joinRoom = async () => {
    const res = await basicFetch.post(
      "/chat/room/join",
      {},
      {
        roomId: room.id,
        password: roomPassword,
        passCheck: false,
      }
    );
    if (res.status == 201) {
      setShowPasswordModal(false);
      setPasswordIsCorrect(true);
      socket.emit("joinRoom", {
        roomId: room.id,
      });
      onJoinRoom();
    } else if (res.status == 401) {
      setPasswordIsCorrect(false);
    }
  };

  return (
    <li
      className={cn(
        "group flex items-center cursor-pointer rounded-lg border border-gray-200 justify-between p-4 hover:bg-gray-50 duration-150",
        {
          "border-red-300": room.am_i_blocked, //tmp
        }
      )}
      onClick={async () => {
        if (room.am_i_member) return;
        if (String(room.type).toLowerCase() === "protected") {
          setShowPasswordModal(true);
        } else {
          await handleJoinRoom();
        }
      }}
    >
      <div className="flex w-full items-center justify-between gap-x-2">
        <div className="flex w-full justify-between gap-x-2">
          <div className="ml-2 flex">
            <Image
              src={room.avatar_url || "/images/default-avatar.png"}
              alt={room.name + " avatar"}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="ml-2">
              <p className="text-sm font-medium">{room.name}</p>
              <p className="text-ellipsis text-xs text-gray-400">
                {truncateString(room.description, 20)}
              </p>
            </div>
          </div>
          <div>
            {room.type === "public" && (
              <span className="text-xs font-semibold text-green-500"></span>
            )}
            {room.type === "protected" && (
              <span className="text-xs font-semibold text-red-500">
                Protected
              </span>
            )}
            <button
              className="ml-2 w-12 items-center
            "
            >
              <span className="text-xs font-semibold text-gray-400">
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
          <div className="flex flex-col items-center justify-center gap-y-4 p-6">
            {passwordIsCoorect ? "" : <h5>password incorrect</h5>}
            <TextInput
              label={`joining room ${room.name}`}
              name="password"
              placeholder="Password"
              inputClassName="pl-12 py-[8px] "
              onChange={(e) => {
                e.preventDefault();
                setRoomPassword(e.target.value);
              }}
            />
            <Button
              type="submit"
              className="w-full"
              onClick={async () => {
                await handleJoinRoom();
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
const ExploreRoomsTab = ({
  socket,
  onSuccess,
}: {
  socket: any;
  onSuccess: () => void;
}) => {
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
      avatar_url: "/images/default-avatar.png",
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
      avatar_url: "/images/default-avatar.png",
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
  }, []);

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
            <IoSearchOutline className="h-6 w-6 text-gray-400 group-focus-within:text-secondary group-hover:text-secondary" />
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

      <ul className="no-scrollbar mt-4 flex h-[calc(60vh-160px)] flex-col gap-y-1 overflow-y-scroll scroll-smooth">
        {!searchError &&
          !searchLoading &&
          searchResults &&
          searchResults?.map((room: IRoom) => (
            <RoomListItem
              key={room.id}
              room={room}
              socket={socket}
              onJoinRoom={onSuccess}
            />
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
