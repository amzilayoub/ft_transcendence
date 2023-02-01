import { Server as IOServer } from "socket.io";

const { Client } = require("pg");

const handler = (req, res) => {
  const client = new Client({
    user: process.env.DB_USERNAME,
    host: "postgres",
    database: process.env.DB_DATABASE_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
  });
  client.connect(function (err) {
    // if (err) throw err;
    console.log("Connected!");
  });
  client.query("SELECT * FROM room_type", function (err, result) {
    if (err) throw err;
    // console.log(result.rows);
  });
  let games = new Array<IGame>();
  let userSockets = new Map<string, string>();

  let roomKeys: { [key: string]: number } = {};
  let game!: IGame;
  let gameStarted!: boolean;

  const server = res.socket?.server;
  let io = server.io;

  if (!io) {
    const io = new IOServer(server);

    server.io = io;

    io.on("connection", (socket) => {
      // spectate as much as you want...
      socket.on("spectate_room", (roomID) => {
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

      socket.on("join_room", (roomID, userID) => {
        console.log("joining roomID:", roomID);

        if (userSockets.get(userID)) {
          socket.emit("error", "user_already_in_a_game"); // ...but only play in one window
          return;
        }
        userSockets.set(userID, socket.id);

        const socketRooms = Array.from(socket.rooms.values()).filter(
          (id) => id !== socket.id
        );

        if (socketRooms.length > 0) {
          socket.emit("error", "socket_already_in_a_room");
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
            socket.emit("error", "room_is_full");
            return;
          }
          socket.emit("state", state);
          if (state === 3) return;
          if (game.p1 && game.p2) {
            io.to(game.p1).to(game.p2).emit("ready");
          }

          games[roomKeys[roomID]] = game;

          io.to("subscribers").emit("get_info", games);
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

      socket.on("game_end", (win, userID) => {
        // pls dont hak me
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        socket.broadcast.to(roomID!).emit("stop_game", win);
        client.query(
          "INSERT INTO games (player_1, player_2, updated_at) VALUES ($1, $2, NOW())",
          [userID, 2]
        );
        client.query("UPDATE users SET score = score + 1 WHERE id = $1", [userID]);
        gameStarted = false;
      });

      socket.on("sub_info", () => {
        socket.join("subscribers");
        socket.emit("get_info", games);
      });

      socket.on("disconnecting", () => {
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        console.log(socket.id, "disconnecting from", roomID);

        game = games[roomKeys[roomID!]]; // i fucking HATE socket io

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
        if (!game.p1 && !game.p2 && game.spectators.length === 0) {
          games.splice(roomKeys[roomID!], 1);
          roomKeys[roomID!] = undefined;
        }

        io.to("subscribers").emit("get_info", games);
        for (const [key, value] of userSockets.entries()) {
          if (value === socket.id) {
            userSockets.delete(key);
          }
        }

        io.to(roomID!).emit("stop_game");
        gameStarted = false;
        if (game?.p1 === undefined) return;

        io.to(game.p1).emit("state", 1);
      });
    });
  }
  res.end();
};

export default handler;
