import React, { useEffect, useState } from "react";

import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { BiBlock } from "react-icons/bi";
import { IoPersonRemoveOutline, IoSearchOutline } from "react-icons/io5";
import { RiVolumeMuteLine } from "react-icons/ri";
import Select from "react-select";

import { RoomInfo } from "@components/chat/ChatSettingsPanel";
import BaseModal from "@ui/BaseModal";
import Button from "@ui/Button";
import ConfirmationModal from "@ui/ConfirmationModal";
import UserListItemLoading from "@ui/skeletons/UserSkeletons";
import TextInput from "@ui/TextInput";
import basicFetch from "@utils/basicFetch";
import { uploadFile } from "@utils/uploadFile";
import {
  IRoom,
  IRoomMember,
  MemberGameStatus,
  MembershipStatus,
} from "global/types";
import { AiOutlineUserAdd } from "react-icons/ai";

const MemberListItem = ({
  member,
  setSearchResults,
  roomId,
  myRole,
  onClose,
  setConversationsMetadata,
  onCloseActiveBox,
  socket,
}: {
  member: IRoomMember;
  setSearchResults: () => {};
  roomId: number;
  myRole: string;
  onClose: () => {};
  setConversationsMetadata: () => {};
  onCloseActiveBox: () => {};
  socket: any;
}) => {
  useEffect(() => {
    if (myRole == undefined) {
      onCloseActiveBox();
      onClose();
      setConversationsMetadata((allConv) => {
        return allConv.filter((cnv) => cnv.room_id != roomId);
      });
      console.log("You don't have access to this room");
    } else myRole = myRole.toLocaleLowerCase();
  }, []);

  const [memberRole, setMemberRole] = useState(member.membershipStatus);

  const handleMute = async (userId: number, muted: boolean) => {
    const resp = await basicFetch.post(
      "/chat/room/mute",
      {},
      {
        roomId,
        userId,
        muted,
      }
    );
    if (resp.status == 201) {
      setSearchResults((state) => {
        const newState = [...state];

        newState.forEach((item) => {
          if (item.id == userId) item.isMuted = muted;
        });
        return newState;
      });
    }
  };

  const handleBlock = async (userId: number, banned: boolean) => {
    // const resp = await basicFetch.post(
    //   "/chat/room/ban",
    //   {},
    //   {
    //     roomId,
    //     userId,
    //     banned,
    //   }
    // );
    socket.emit(
      "room/ban",
      {
        roomId,
        userId,
        banned,
      },
      (resp) => {
        if (resp.status == 200) {
          setSearchResults((state) => {
            const newState = [...state];

            newState.forEach((item) => {
              if (item.id == userId) item.isBanned = banned;
            });
            return newState;
          });
        } else {
          alert("You don't have enough access rights to complete the action");
        }
      }
    );
  };

  const handleKick = async (userId: number) => {
    socket.emit(
      "room/kickout",
      {
        roomId,
        userId,
      },
      (resp) => {
        if (resp.status != 401) {
          const respObj = resp;
          if (
            myRole.toLocaleLowerCase() == "member" ||
            resp.status == 205 ||
            resp.status == 204
          ) {
            onCloseActiveBox();
            onClose();
            setConversationsMetadata((allConv) => {
              return allConv.filter((cnv) => cnv.room_id != roomId);
            });
          } else {
            setSearchResults((state: any) => {
              const newState = [...state];
              if ((respObj.status = 200))
                newState.forEach((item) => {
                  if (item.id == userId) {
                    item.membershipStatus = "User";
                  }
                });
              return newState;
            });
          }
        } else {
          alert("You don't have enough access rights to complete the action");
        }
      }
    );
    // const resp = await basicFetch.post(
    //   "/chat/room/kickout",
    //   {},
    //   {
    //     roomId,
    //     userId,
    //   }
    // );
  };

  const handleAddUser = async (roomId: number, userId: number) => {
    const res = await basicFetch.post(
      "/chat/room/join",
      {},
      {
        roomId,
        userId,
        passCheck: true,
      }
    );
    if (res.status == 201) {
      socket.emit(
        "joinRoom",
        {
          roomId,
          userId,
        },
        (resp) => {
          if (resp.status == 200) {
            setSearchResults((state) => {
              const newState = [...state];
              newState.forEach((item) => {
                if (item.id == userId) {
                  item.membershipStatus = "Member";
                }
              });
              return newState;
            });
          }
        }
      );
    }
    // const resp = await basicFetch.post(
    //   "/chat/room/add",
    //   {},
    //   {
    //     roomId,
    //     userId,
    //   }
    // );
    // if (resp.status == 201) {
    //   setSearchResults((state) => {
    //     const newState = [...state];
    //     newState.forEach((item) => {
    //       if (item.id == userId) {
    //         item.membershipStatus = "Member";
    //       }
    //       return newState;
    //     });
    //   });
    // } else {
    //   alert("You don't have enough access rights to complete the action");
    // }
  };

  const handleRoleChange = async (userId: number, role: MembershipStatus) => {
    const resp = await basicFetch.post(
      "/chat/room/role",
      {},
      {
        roomId,
        userId,
        role,
      }
    );
    if (resp.status == 201) {
      setMemberRole(role);
    } else {
      alert("You don't have enough access rights to complete the action");
    }
  };

  return (
    <li
      className={cn(
        "group flex items-center cursor-pointer rounded-lg border border-gray-200 justify-between p-4 hover:bg-gray-50 duration-150",
        {
          // "border-red-300": room.am_i_blocked, //tmp
        }
      )}
    >
      <div className="flex w-full items-center justify-between gap-x-2">
        <div className="flex w-full justify-between gap-x-2">
          <div className="ml-2 flex w-full flex-row items-center justify-between ">
            <div>
              <Link
                href={`/u/${member.username}`}
                className="ml-2 flex w-32 items-center gap-4"
              >
                <figure className="relative flex h-8 w-8 items-center justify-center rounded-full">
                  <Image
                    src={member.avatar_url}
                    alt={member + " avatar"}
                    fill
                    className="rounded-full object-cover"
                  />
                </figure>

                <p className="text-sm font-medium">{member.username}</p>
              </Link>
            </div>
            <div>
              {/* <p className="text-sm text-gray-400">{member.membershipStatus}</p> */}
              {member.membershipStatus.toLocaleLowerCase() == "owner" ? (
                <p className="text-sm text-gray-400">Owner</p>
              ) : (
                <>
                  {member.membershipStatus.toLocaleLowerCase() == "user" ? (
                    ""
                  ) : (
                    <Select
                      className="w-32"
                      options={[
                        { value: "admin", label: "Admin" },
                        { value: "moderator", label: "Moderator" },
                        { value: "member", label: "Member" },
                      ]}
                      value={{
                        value: member.membershipStatus,
                        label:
                          member.membershipStatus.charAt(0).toUpperCase() +
                          member.membershipStatus.slice(1),
                      }}
                      onChange={(option: any) => {
                        handleRoleChange(member.id, option.value);
                      }}
                    />
                  )}
                </>
              )}
            </div>
            <div className="flex gap-2">
              {!["owner", "user"].includes(
                String(member.membershipStatus).toLocaleLowerCase()
              ) &&
              (myRole == "owner" ||
                (myRole == "admin" &&
                  String(member.membershipStatus).toLocaleLowerCase() ==
                    "member")) ? (
                <>
                  <RiVolumeMuteLine
                    onClick={async () => {
                      await handleMute(member.id, !member.isMuted);
                    }}
                    className={
                      "h-8 w-8 rounded-full p-1 text-2xl duration-300 " +
                      (member.isMuted
                        ? "bg-red-800 text-white hover:bg-gray-300"
                        : "bg-gray-200 text-red-800 hover:bg-white-300")
                    }
                  />
                  <BiBlock
                    onClick={async () => {
                      await handleBlock(member.id, !member.isBanned);
                    }}
                    className={
                      "h-8 w-8 rounded-full p-1 text-2xl duration-300 " +
                      (member.isBanned
                        ? "bg-red-800 text-white hover:bg-gray-300"
                        : "bg-gray-200 text-red-800 hover:bg-white-300")
                    }
                  />
                </>
              ) : (
                ""
              )}
              {member.membershipStatus.toLocaleLowerCase() == "user" &&
              ["admin", "owner"].includes(myRole) ? (
                <AiOutlineUserAdd
                  onClick={() => {
                    handleAddUser(roomId, member.id);
                  }}
                  className="h-8 w-8 rounded-full bg-gray-200 p-1 text-2xl text-green-800 duration-300 hover:bg-gray-300"
                />
              ) : (
                <>
                  {member.isMe ||
                  myRole == "owner" ||
                  (myRole == "admin" &&
                    ["admin", "member"].includes(
                      member.membershipStatus.toLocaleLowerCase()
                    )) ? (
                    <IoPersonRemoveOutline
                      onClick={async () => {
                        await handleKick(member.id);
                      }}
                      className="h-8 w-8 rounded-full bg-gray-200 p-1 text-2xl text-red-800 duration-300 hover:bg-gray-300"
                    />
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

// const RoomMembers = () => {
//   return (
//     <div className="h-2/3 p-8">
//       <h2 className="text-2xl font-bold">Room Members</h2>
//       <div className="h-px bg-gray-200 " />
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           //console.log("search");
//         }}
//         className="group relative h-10 w-full"
//       >
//         <label className="absolute top-3 left-3 flex items-center justify-center text-gray-400">
//           <button type="submit" className="h-full w-full cursor-default">
//             <IoSearchOutline className="h-6 w-6 text-gray-400 group-focus-within:text-secondary group-hover:text-secondary" />
//           </button>
//         </label>
//         <TextInput
//           name="search"
//           placeholder="Search for a member"
//           onChange={(e) => handleSearchChange(e)}
//           inputClassName="pl-12 py-[8px] "
//         />
//       </form>
//       <ul className="no-scrollbar mt-4 flex h-[calc(60vh-160px)] flex-col gap-y-1 overflow-y-scroll scroll-smooth">
//         {!searchError &&
//           !searchLoading &&
//           searchResults &&
//           searchResults?.map((member: IRoomMember, index: number) => (
//             <MemberListItem
//               key={index}
//               member={member}
//               setSearchResults={setSearchResults}
//               roomId={roomData.room_id}
//               myRole={myRole}
//             />
//           ))}
//         {searchLoading &&
//           [...new Array(6)].map((i) => <UserListItemLoading key={i} />)}
//         {!searchError && searchResults?.length === 0 && (
//           <p className="py-10 text-center text-gray-400">No results found</p>
//         )}
//       </ul>
//     </div>
//   );
// };

const ChatroomSettingsModal = ({
  roomData,
  isOpen = false,
  onClose = () => {},
  setConversationsMetadata,
  onCloseActiveBox,
  socket,
}: {
  roomData: IRoom;
  isOpen: boolean;
  onClose: () => void;
  setConversationsMetadata: () => {};
  onCloseActiveBox: () => {};
  socket: any;
}) => {
  const [shouldSearch, setShouldSearch] = useState<boolean>(false);
  const [myRole, setMyRole] = useState("member");
  const searchError = false;
  const searchLoading = false;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [buttonText, setButtonText] = useState("Save");

  const [roomAvatar, setRoomAvatar] = useState(null);
  const [settings, setSettings] = useState({});

  const CurrentUser: IRoomMember = {
    id: 1,
    username: "mbif",
    avatar_url: "https://i.imgur.com/0y0tj9X.png",
    isOnline: true,
    gameStatus: MemberGameStatus.IDLE,
    membershipStatus: MembershipStatus.OWNER,
    isBanned: false,
    isMuted: false,
    mutedUntil: new Date(),
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    getRoomMembers(e.target.value).then((data) => {
      setSearchResults(data.members);
    });
    setShouldSearch(false);
  };

  const getRoomMembers = async (username: string = "") => {
    const resp = await basicFetch.get(
      `/chat/room/${roomData.room_id}/members/${username}`
    );

    if (resp.status == 200) {
      return await resp.json();
    }
    return [];
  };

  useEffect(() => {
    getRoomMembers().then((data) => {
      setSearchResults(data.members);
      setMyRole(data.myRole);
    });
  }, [true]);

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setButtonText("Saving...");

    try {
      //   if (roomAvatar) {
      let file_data = {};
      if (roomAvatar) {
        setButtonText("Uploading...");
        file_data = await uploadFile(roomAvatar);
      }
      if (file_data || roomData.avatar_url) {
        const resp = await basicFetch.post(
          "/chat/room/update-info",
          {},
          {
            name: settings.name || roomData.name,
            roomTypeName: settings.roomeType || "public",
            avatarUrl: file_data?.secure_url || roomData.avatar_url,
            roomId: roomData.room_id,
          }
        );

        if (resp.status == 201) {
          await resp.json();
          setConversationsMetadata((state) => {
            const newState = [...state];
            newState.forEach((item) => {
              if (item.room_id == roomData.room_id) {
                item.avatar_url = file_data?.secure_url || roomData.avatar_url;
                item.name = settings.name || roomData.name;
              }
            });
            return newState;
          });
          setButtonText("Saving...");
          setIsSaving(false);
          setButtonText("Save");
          onClose();
        }
        // }
      }
    } catch (error) {
      //console.log(error);
    } finally {
      setIsSaving(false);
      setButtonText("Save");
    }
  };

  const handleDeleteRoom = async () => {
    try {
      const res = await basicFetch.get(`/chat/room/${roomData.room_id}/delete`);
      if (res.ok) {
        onClose();
      }
    } catch (error) {
      //console.log(error);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className=" max-h-[1000px] w-[800px]">
        <div className="flex h-1/3 items-center justify-between">
          {CurrentUser.membershipStatus === MembershipStatus.OWNER && (
            <RoomInfo
              roomData={roomData}
              setAvatar={setRoomAvatar}
              setSettings={setSettings}
            />
          )}
        </div>
        {/* <RoomMembers /> */}

        <div className=" p-8">
          <h2 className="text-2xl font-bold">Room Members</h2>
          <div className="h-px bg-gray-200 " />
          <div className="pt-4 ">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                //console.log("search");
              }}
              className="group relative h-10 w-full "
            >
              <label className="absolute top-3 left-3 flex items-center justify-center text-gray-400">
                <button type="submit" className="h-full w-full cursor-default">
                  <IoSearchOutline className="h-6 w-6 text-gray-400 group-focus-within:text-secondary group-hover:text-secondary" />
                </button>
              </label>
              <TextInput
                name="search"
                placeholder="Search for a member"
                onChange={(e) => handleSearchChange(e)}
                inputClassName="pl-12 py-[8px] "
              />
            </form>
            <ul className="no-scrollbar mt-4 flex  flex-col gap-y-1 overflow-y-scroll scroll-smooth">
              {!searchError &&
                !searchLoading &&
                searchResults &&
                searchResults?.map((member: IRoomMember, index: number) => (
                  <MemberListItem
                    key={index}
                    member={member}
                    setSearchResults={setSearchResults}
                    roomId={roomData.room_id}
                    myRole={myRole}
                    onClose={onClose}
                    setConversationsMetadata={setConversationsMetadata}
                    onCloseActiveBox={onCloseActiveBox}
                    socket={socket}
                  />
                ))}
              {searchLoading &&
                [...new Array(6)].map((i) => <UserListItemLoading key={i} />)}
              {!searchError && searchResults?.length === 0 && (
                <p className="py-10 text-center text-gray-400">
                  No results found
                </p>
              )}
            </ul>
          </div>
          <div className="flex h-full w-full items-end justify-end pt-5">
            <div className="flex gap-x-2 ">
              <Button
                variant="danger"
                onClick={() => setConfirmModalOpen(true)}
              >
                Delete Room
              </Button>
              <Button
                variant="primary"
                type="submit"
                isLoading={isSaving}
                onClick={handleSave}
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {confirmModalOpen && (
        <ConfirmationModal
          isOpen={confirmModalOpen}
          onCancel={() => setConfirmModalOpen(false)}
          onConfirm={handleDeleteRoom}
          title="Delete Room"
          message={`Are you sure you want to delete this room?\nThis action cannot be undone.`}
        />
      )}
    </BaseModal>
  );
};

export default ChatroomSettingsModal;
