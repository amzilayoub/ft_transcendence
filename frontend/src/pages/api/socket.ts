import { Server as IOServer } from "socket.io";

import basicFetch from "@utils/basicFetch";
import { IGame } from "@utils/game/IGame";

// import { Client } from "pg";

const handler = (req, res) => {
  // const client = new Client({
  //   user: process.env.DB_USERNAME,
  //   host: process.env.DB_HOST,
  //   database: process.env.DB_DATABASE_NAME,
  //   password: process.env.DB_PASSWORD,
  //   port: 5432,
  // });

  // client.connect(function (err) {
  //   // if (err) throw err;
  //   //console.log("Connected!");
  // });

  // client.query("SELECT * FROM room_type", function (err, result) {
  //   if (err) throw err;
  //   // //console.log(result.rows);
  // });
  let games = new Array<IGame>();

  let roomKeys: { [key: string]: number } = {};
  let game!: IGame;

  const server = res.socket?.server;
  let io = server.io;

  if (!io) {
    const io = new IOServer(server);

    server.io = io;

    io.on("connection", (socket) => {
      // spectate as much as you want...
      socket.on("spectate_room", (roomID, userID) => {
        //console.log("spectating roomID:", roomID);
        socket.join(roomID!);

        if (
          roomKeys[roomID] === undefined ||
          games[roomKeys[roomID]].p1 === undefined
        ) {
          socket.emit("error", "room_not_found");
          return;
        }
        socket.emit(
          "state",
          3,
          games[roomKeys[roomID]].gameStarted,
          games[roomKeys[roomID]].mode
        );

        games[roomKeys[roomID]].spectators.push({
          socketID: socket.id,
          userID: userID,
        });
        io.to("subscribers").emit("get_info", games);
      });

      socket.on("join_room", (roomID, userID, mode, username, avatar_url) => {
        //console.log(username, "joining roomID:", roomID);

        const socketRooms = Array.from(socket.rooms.values()).filter(
          (id) => id !== socket.id
        );

        if (socketRooms.length > 0) {
          socket.emit("error", "socket_already_in_a_room");
        } else if (
          games.find((game) => game.p1?.userID === userID) !== undefined
        ) {
          socket.emit("error", "user_already_in_a_room");
        } else {
          if (roomKeys[roomID] === undefined) {
            games.push({
              roomID: roomID,
              p1: undefined,
              p2: undefined,
              spectators: [],
              gameReady: false,
              gameStarted: false,
              mode: undefined,
            });
            roomKeys[roomID] = games.length - 1;
          }
          socket.join(roomID!);

          game = games[roomKeys[roomID]]; // i fucking HATE socket io

          let state!: number;
          if (game.p1 === undefined) {
            state = 1;
            game.mode = mode;
            game.p1 = {
              userID: userID,
              score: 0,
              socketID: socket.id,
              username: username,
              avatar_url: avatar_url,
            };
          } else if (game.p2 === undefined) {
            if (mode !== game.mode) {
              socket.emit("error", "mode_mismatch");
              return;
            }
            state = 2;
            game.p2 = {
              userID: userID,
              score: 0,
              socketID: socket.id,
              username: username,
              avatar_url: avatar_url,
            };
          } else {
            socket.emit("error", "room_is_full");
            return;
          }
          socket.emit("state", state);
          if (game.p1 && game.p2) {
            io.to(game.p1.socketID).to(game.p2.socketID).emit("ready");
            game.gameReady = true;
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
        if (socket.id === game.p1?.socketID) {
          const roomID = Array.from(socket.rooms.values()).find(
            (id) => id !== socket.id
          );

          io.to(roomID!).emit("moved", { p1: dir, p2: undefined }); // diha fmok
        } else if (socket.id === game.p2?.socketID) {
          const roomID = Array.from(socket.rooms.values()).find(
            (id) => id !== socket.id
          );

          io.to(roomID!).emit("moved", { p2: dir, p1: undefined }); // diha fmok
        }
      });

      socket.on("ping", (t0) => {
        socket.emit("ping", t0);
      });

      socket.on("ready", () => {
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        game = games[roomKeys[roomID!]];

        if (game.gameReady || !game || !game.p1 || !game.p2) {
          return;
        }
        if (socket.id === game.p1?.socketID) {
          game.gameReady = true;
          io.to(game.p2.socketID).emit("ready");
        } else if (socket.id === game.p2?.socketID) {
          game.gameReady = true;
          io.to(game.p1.socketID).emit("ready");
        }
      });

      socket.on("not_ready", () => {
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        game = games[roomKeys[roomID!]];
        if (!game || !game.gameReady) {
          return;
        }

        if (game.gameStarted) {
          if (game.p2.socketID === socket.id) {
            game.p1.score = 5;
          } else if (game.p1.socketID === socket.id) {
            game.p2.score = 5;
          }
          gameEnd(game.p2.socketID === socket.id, game.p1.userID); // defaulting to p1 for consistency
          return;
        }

        if (socket.id === game.p1?.socketID) {
          game.gameReady = false;
          io.to(game.p2?.socketID).emit("not_ready");
        } else if (socket.id === game.p2?.socketID) {
          game.gameReady = false;
          io.to(game.p1?.socketID).emit("not_ready");
        }
      });

      socket.on("start_game", (velocity) => {
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        game = games[roomKeys[roomID!]];
        if (!game) return;
        if (game.gameReady) {
          io.to(roomID!).emit("start_game", velocity); // diha fmok
          game.gameStarted = true;
        }
      });

      socket.on("sync", (py, idx) => {
        // pls dont hak me
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        io.to(roomID!).emit("sync", py, idx);
      });

      socket.on("ball_sync", (newBall) => {
        // pls dont hak me
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        io.to(roomID!).emit("ball_sync", newBall);
      });

      socket.on("powerup", (powerUp) => {
        // pls dont hak me
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        //console.log("powerup from server");

        io.to(roomID!).emit("powerup", powerUp);
      });

      const gameEnd = async (win: boolean, userID: string) => {
        // pls dont hak me
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );

        game = games[roomKeys[roomID!]];
        if (!game) return;

        game.gameStarted = false;
        io.to(roomID!).emit("stop_game", win);

        try {
          const resp = await basicFetch.post(
            "/games",
            {},
            {
              player_1: +game.p1.userID,
              player_2: +game.p2.userID,
              player_1_score: game.p1.score,
              player_2_score: game.p2.score,
              winner: +(win ? userID : game.p2.userID),
              mode: game.mode,
            }
          );
        } catch (err) {
          console.log(err);
        }

        game.p1.score = 0;
        game.p2.score = 0;
      };

      socket.on("score", (goalOf, userID) => {
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        game = games[roomKeys[roomID!]];
        if (!game || !game.gameReady) return;
        if (
          (goalOf && game.p1.userID === userID) ||
          (!goalOf && game.p2.userID === userID)
        ) {
          game.p1.score++;
        } else {
          game.p2.score++;
        }
        io.to(roomID!).emit("score", {
          p1: {
            score: game.p1.score,
          },
          p2: {
            score: game.p2.score,
          },
        });
        let scoreToWin = 5;
        if (game.mode === "blitz") scoreToWin = 5;
        else if (game.mode === "classic") scoreToWin = 5;
        if (game.p1.score >= scoreToWin || game.p2.score >= scoreToWin) {
          gameEnd(game.p1.score >= scoreToWin, userID); // userID is always p1
        }
      });

      socket.on("sub_info", () => {
        socket.join("subscribers");
        socket.emit("get_info", games);
      });

      socket.on("disconnecting", () => {
        const roomID = Array.from(socket.rooms.values()).find(
          (id) => id !== socket.id
        );
        //console.log(socket.id, "disconnecting from", roomID);
        if (roomID === "subscribers") return;
        game = games[roomKeys[roomID!]]; // i fucking HATE socket io

        //console.log("game: ", game);

        if (!game) return;

        if (game.p1?.socketID === socket.id) {
          game.p1 = game.p2;
          if (game.p1) game.p1.score = 0;
          game.p2 = undefined;
        } else if (game.p2?.socketID === socket.id) {
          game.p2 = undefined;
        } else {
          game.spectators = game.spectators.filter(
            (spectator) => spectator.socketID !== socket.id
          );
          io.to("subscribers").emit("get_info", games);
          return;
        }
        if (!game.p1 && !game.p2) {
          io.to(roomID!).emit("error", "room_is_empty");
          games.splice(roomKeys[roomID!], 1);
          roomKeys[roomID!] = undefined;
        }

        io.to("subscribers").emit("get_info", games);

        io.to(roomID!).emit("stop_game");
        game.gameStarted = false;
        if (game?.p1 === undefined) return;

        io.to(game.p1.socketID).emit("state", 1);
      });
    });
  }
  res.end();
};

export default handler;
