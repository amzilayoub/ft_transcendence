import React from "react";

import Head from "next/head";
import Link from "next/link";

import Leftbar from "@components/chat/Leftbar";
import MiddleBar from "@components/chat/MiddleBar";

const Rooms = () => {
  const rooms = [
    {
      id: 1,
      name: "room1",
      users: [
        {
          id: 1,
          name: "user1",
          messages: [
            {
              id: 1,
              content: "hello",
              timestamp: "2021-10-10 12:00:00",
            },
            {
              id: 2,
              content: "hello",
              timestamp: "2021-10-10 12:00:00",
            },
            {
              id: 3,
              content: "hello",
              timestamp: "2021-10-10 12:00:00",
            },
          ],
        },
        {
          id: 2,
          name: "user2",
          messages: [
            {
              id: 1,
              content: "hello",
              timestamp: "2021-10-10 12:00:00",
            },
            {
              id: 2,
              content: "hello",
              timestamp: "2021-10-10 12:00:00",
            },
            {
              id: 3,
              content: "hello",
              timestamp: "2021-10-10 12:00:00",
            },
          ],
        },
        {
          id: 3,
          name: "user3",
          messages: [
            {
              id: 1,
              content: "hello",
              timestamp: "2021-10-10 12:00:00",
            },
            {
              id: 2,
              content: "hello",
              timestamp: "2021-10-10 12:00:00",
            },
            {
              id: 3,
              content: "hello",
              timestamp: "2021-10-10 12:00:00",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "room2",
      users: [
        {
          id: 1,
          name: "user1",
          messages: [
            {
              id: 1,
              content: "hello",
              timestamp: "2021-10-10 12:00:00",
            },
            {
              id: 2,
              content: "hello",
              timestamp: "2021-10-10 12:00:00",
            },
            {
              id: 3,
              content: "hello",
              timestamp: "2021-10-10 12:00:00",
            },
          ],
        },
        {
          id: 2,
          name: "user2",
          messages: [
            {
              id: 1,
              content: "hello",
              timestamp: "2021-10-10 12:00:00",
            },
            {
              id: 2,
              content: "hello",
              timestamp: "2021-10-10 12:00:00",
            },
            {
              id: 3,
              content: "hello",
              timestamp: "2021-10-10 12:00:00",
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className="flex">
      <Head>
        <title>Rooms</title>
      </Head>
      <Leftbar />

      <MiddleBar title="Rooms">
        {rooms.map((room) => (
          <Link
            href={`/room/${room.id}`}
            key={room.id}
            className="hover:bg-primary-600 transition duration-300 flex flex-col space-y-2 w-full h-14 flex flex-col justify-center bg-[#303841] rounded-sm p-2 cursor-pointer"
          >
            <h1 className="text-white text-xl">{room.name}</h1>
          </Link>
        ))}
      </MiddleBar>
    </div>
  );
};

export default Rooms;

{
  /* <div className="flex flex-col space-y-5 w-full">
          {rooms.map((room) => (
            <Link
              href={`/room/${room.id}`}
              key={room.id}
              className="hover:bg-primary-600 transition duration-300 flex flex-col space-y-2 w-full bg-[#262E35] rounded-lg p-2 cursor-pointer"
            >
              <h1 className="text-white text-xl">{room.name}</h1>
            </Link>
          ))}
        </div> */
}
