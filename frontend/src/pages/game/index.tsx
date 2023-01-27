import React, { useState } from "react";

import Pong from "@components/game/pong";
import Button from "@ui/Button";
import TextInput from "@ui/TextInput";
import { io, Socket } from "socket.io-client";

let socket!: Socket;
let games!: Socket;

const GameSettings = ({
  setRoomID,
}: {
  setRoomID: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [input, setInput] = useState("");


  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRoomID(input);
  };
  return (
    <>
      <form onSubmit={onSubmitHandler}>
        <TextInput
          label=""
          placeholder="Enter a Room ID to join"
          name="room"
          onChange={(e) => {
            onChangeHandler(e);
          }}
        />
        <Button type="submit">Join Room</Button>
      </form>
    </>
  );
};

const Game = () => {
  // should not be here if not signed in

  const [roomID, setRoomID] = useState("");

  // const func = async () => {
  //   // fetch(`/api/socket`);
  //   socket = io("ws://localhost:3000/api/socket");

  //   socket.on("get_info", (info) => {
  //     games = info;
  //   });
  // };

  // func();

  // console.log(games);

  return (
    <>
      {roomID ? (
        <Pong roomID={roomID} />
      ) : (
        <GameSettings setRoomID={setRoomID} />
      )}
      <Button
        onClick={() => {
          debugger;
        }}
      >
        Debugger
      </Button>
    </>
  );
};

export default Game;
