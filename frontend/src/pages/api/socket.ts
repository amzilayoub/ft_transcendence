import { IGame } from "@utils/game/IGame";
import { IGameState } from "@utils/game/IGameState";
import { Server as IOServer } from "socket.io";

const handler = (req, res) => {
  let games = new Array<IGame>();

  let roomKeys: { [key: string]: number } = {};
  let game!: IGame;
  let gameStarted!: boolean;

  const server = res.socket?.server;
  let io = server.io;

  if (!io) {
    const io = new IOServer(server);

    server.io = io;

    io.on("connection", (socket) => {
      socket.on("spectate_room", (msg) => {
        let roomID = msg;
        console.log("spectating roomID:", roomID);
        socket.emit("state", 3, gameStarted);
        socket.join(roomID!);

        if (roomKeys[roomID] === undefined) {
          games.push({
            roomID: roomID,
            p1: undefined,
            p2: undefined,
            spectators: [],
          });
          roomKeys[roomID] = games.length - 1;
        }

        games[roomKeys[roomID]].spectators.push(socket.id);
        io.to("subscribers").emit("get_info", games);
      });

      socket.on("join_room", (msg) => {
        let roomID = msg;
        console.log("roomID:", roomID);
        // TODO: check valid roomID

        const socketRooms = Array.from(socket.rooms.values()).filter(
          (id) => id !== socket.id
        );

        if (socketRooms.length > 0) {
          socket.emit("error");
        } else {
          if (roomKeys[roomID] === undefined) {
            games.push({
              roomID: roomID,
              p1: undefined,
              p2: undefined,
              spectators: [],
            });
            roomKeys[roomID] = games.length - 1;
          }
          socket.join(roomID!);

          game = games[roomKeys[roomID]]; // i fucking HATE socket io

          let state!: number;
          if (game.p1 === undefined) {
            state = 1;
            game.p1 = socket.id;
          } else if (game.p2 === undefined) {
            state = 2;
            game.p2 = socket.id;
          } else {
            socket.emit("error");
            return;
          }
          socket.emit("state", state);
          // {
          //   io.to(roomID!).emit(
          //     "broadcast",
          //     `player 1: ${game.p1} -- player 2: ${game.p2}`
          //   );

          //   const connectedSockets = io.sockets.adapter.rooms.get(roomID!);

          //   io.to(roomID!).emit(
          //     "broadcast",
          //     `spectators: \n${Array.from(connectedSockets.values()).filter(
          //       (socket) => socket !== game.p1 && socket !== game.p2
          //     )}\n`
          //   );
          //     const rooms = io.sockets.adapter.rooms;
          //     rooms.forEach((set, key) => {
          //       if (set.has(key)) rooms.delete(key);
          //     });

          //     // console.log("rooms: ", rooms);
          //     // io.to(roomID!).emit("roomsCount", rooms.size);
          //     // io.to(roomID!).emit("clientsCount", connectedSockets?.size);
          // }
          if (state === 3) return;
          if (game.p1 && game.p2) {
            io.to(game.p1).to(game.p2).emit("ready");
          }

          games[roomKeys[roomID]] = game;

          io.to("subscribers").emit("get_info", games);
          console.log("games: ", games);
        }
      });

      socket.on("move", (dir) => {
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        game = games[roomKeys[roomID!]]; // i fucking HATE socket io
        if (!game) return;
        if (socket.id === game.p1) {
          const roomID = Array.from(socket.rooms.values()).find(
            (id) => id !== socket.id
          );

          io.to(roomID!).volatile.emit("moved", { p1: dir, p2: undefined }); // diha fmok
        } else if (socket.id === game.p2) {
          const roomID = Array.from(socket.rooms.values()).find(
            (id) => id !== socket.id
          );

          io.to(roomID!).volatile.emit("moved", { p2: dir, p1: undefined }); // diha fmok
        }
      });

      socket.on("ping", (t0) => {
        socket.emit("ping", t0);
      });

      socket.on("start_game", () => {
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        io.to(roomID!).emit("start_game"); // diha fmok
        gameStarted = true;
        // console.log("start_game", roomID);
      });

      socket.on("sync", (py, idx) => {
        // pls dont hak me
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        socket.broadcast.to(roomID!).emit("sync", py, idx);
      });

      socket.on("ball_sync", (newBall) => {
        // pls dont hak me
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        socket.broadcast.volatile.to(roomID!).emit("ball_sync", newBall);
      });

      socket.on("game_end", (win) => {
        // pls dont hak me
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        socket.broadcast.to(roomID!).emit("stop_game", win);
        gameStarted = false;
      });

      socket.on("sub_info", () => {
        socket.join("subscribers");
        io.to("subscribers").emit("get_info", games);
      });

      socket.on("disconnecting", () => {
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        console.log("disconnecting", roomID);

        game = games[roomKeys[roomID!]]; // i fucking HATE socket io

        console.log(game);

        if (!game) return;

        if (game.p1 === socket.id) {
          game.p1 = game.p2;
          game.p2 = undefined;
        } else if (game.p2 === socket.id) {
          game.p2 = undefined;
        } else {
          game.spectators = game.spectators.filter((id) => id !== socket.id);
          io.to("subscribers").emit("get_info", games);
          return;
        }
        io.to("subscribers").emit("get_info", games);

        io.to(roomID!).emit("stop_game");
        gameStarted = false;
        // console.log(`sending to ${game.p1} state wait`);
        if (game.p1 === undefined) return;

        io.to(game.p1).emit("state", 1);

        // console.log("io.sockets.sockets.get(game.p1) = ", io.sockets.sockets.get(game.p1))
        // io.sockets.sockets.get(game.p1)?.emit("state", "wait")
      });
    });
  }
  res.end();
};

export default handler;
