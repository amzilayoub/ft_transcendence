import { IGameState } from "@utils/game/IGameState";
import { Server as IOServer } from "socket.io";

const handler = (req, res) => {
  let p1!: string; // bad way to keep track
  let p2!: string;
  let gameState: IGameState = {
    p1: {
      pos: { y: 0 },
      vel: { y: 0 },
    },
    p2: {
      pos: { y: 0 },
      vel: { y: 0 },
    },
  };

  const server = res.socket?.server;
  let io = server.io;

  if (!io) {
    const io = new IOServer(server);

    server.io = io;

    io.on("connection", (socket) => {
      socket.on("join_room", (msg) => {
        let roomID = msg;
        console.log("roomID:", roomID);
        // TODO: check valid roomID

        const socketRooms = Array.from(socket.rooms.values()).filter(
          (id) => id !== socket.id
        );

        if (socketRooms.length > 0) {
          socket.emit("room_join_error", {
            error: "you are already in a room",
          });
        } else {
          socket.join(roomID);

          const connectedSockets = io.sockets.adapter.rooms.get(roomID);

          let state!: string;
          switch (connectedSockets?.size) {
            case 1:
              state = "wait";
              p1 = socket.id;
              break;
            case 2:
              state = "gaming";
              p2 = socket.id;
              break;
            default:
              state = "spectate";
              break;
          }

          io.to(roomID).emit("broadcast", `player 1: ${p1} -- player 2: ${p2}`);

          io.to(roomID).emit(
            "broadcast",
            `spectators: \n${Array.from(connectedSockets.values()).filter(
              (socket) => socket !== p1 && socket !== p2
            )}\n`
          );

          const rooms = io.sockets.adapter.rooms;
          rooms.forEach((set, key) => {
            if (set.has(key)) rooms.delete(key);
          });

          console.log("rooms: ", rooms);

          io.to(roomID).emit("state", state);
          io.to(roomID).emit("roomsCount", rooms.size);
          io.to(roomID).emit("clientsCount", connectedSockets?.size);
        }
      });

      socket.on("move", (playerY, playerVelY) => {
        if (socket.id === p1) {
          const roomID = Array.from(socket.rooms.values()).find(
            (id) => id !== socket.id
          );
          if (!roomID)
            console.log('ROOMID IS UNDEFINED IN MOVE DEFAULTING TO ""');

          socket.broadcast.to(roomID || "").emit("game_state", {
            ...gameState,
            p1: {
              pos: { y: playerY },
              vel: { y: playerVelY },
            },
          }); // TODO: more data for protection
        } else if (socket.id === p2) {
          const roomID = Array.from(socket.rooms.values()).find(
            (id) => id !== socket.id
          );
          if (!roomID)
            console.log('ROOMID IS UNDEFINED IN MOVE DEFAULTING TO ""');
          socket.broadcast.to(roomID || "").emit("game_state", {
            ...gameState,
            p2: {
              pos: { y: playerY },
              vel: { y: playerVelY },
            },
          });
        }
      });
      socket.on("start_game", () => {
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        if (!roomID)
          console.log('ROOMID IS UNDEFINED IN START_GAME DEFAULTING TO ""');
        socket.broadcast.to(roomID || "").emit("start_game");
        // console.log("start_game", roomID);
      });
      // socket.on("disconnect", () => {
      //   console.log(socket.id, "disconnected from room ", roomID);
      //   if (p1 == socket.id) p1 = "";
      //   else if (p2 == socket.id) p2 = "";
      // });

      socket.on("hi", () => {
        socket.broadcast.to(roomID).emit("hi");
      });
    });
  }

  res.end();
};

export default handler;
