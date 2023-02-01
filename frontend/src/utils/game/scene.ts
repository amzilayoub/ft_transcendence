// TODO: move game logic to server and send controls only
import Router from "next/router";
import { Scene } from "phaser";
import { io, Socket } from "socket.io-client";

let paddle2!: Phaser.Physics.Arcade.Sprite;
let paddle1!: Phaser.Physics.Arcade.Sprite;
let ball!: Phaser.Physics.Arcade.Sprite;

let startText!: Phaser.GameObjects.Text;

let ready: boolean = false;
let gameStarted: boolean = false;
let p1!: boolean;
let p2!: boolean;

let width!: number;
let height!: number;

let centerY!: number;
let centerX!: number;

let dir!: number;
let tickCount: number = 0;

let socket!: Socket;
let state!: number;
let userID!: string;
let pressedKeys = new Set<string>();

export default class pongScene extends Scene {
  createPaddle = (x: number, y: number) => {
    const paddle = this.physics.add
      .sprite(x, y, "paddle")
      .setImmovable(true)
      .setScale(0.5)
      .setCollideWorldBounds(true);
    // .setOrigin(0.5);
    this.physics.add.collider(ball, paddle, () => {
      if (p1) {
        const newBall = {
          pos: {
            x: ball.x,
            y: ball.y,
          },
          vel: {
            x: ball.body.velocity.x,
            y: ball.body.velocity.y,
          },
        };

        socket.volatile.emit("ball_sync", newBall);
      }
    });
    return paddle;
  };

  preload() {
    this.load.image("paddle", "/assets/paddle.png");
    this.load.image("ball", "/assets/small_ball.png");
    this.game.sound.destroy();
  }

  create() {
    this.game.events.on("pause", () => {
      console.log("pause");
      socket.disconnect();
      Router.push("/game");
    });
    width = this.game.canvas.width;
    height = this.game.canvas.height;
    centerX = width / 2;
    centerY = height / 2;

    ball = this.physics.add
      .sprite(centerX, centerY, "ball")
      .setCollideWorldBounds(true)
      .setScale(0.5)
      .setBounce(1.01, 1);
    // .setOrigin(0.5);
    startText = this.add
      .text(centerX, centerY / 2, "", {
        fontSize: "40px",
        align: "center",
      })
      .setOrigin(0.5);

    paddle1 = this.createPaddle(48, centerY);
    paddle2 = this.createPaddle(width - 48, centerY);

    // style: Phaser.GameObjects.TextStyle = { fontSize: "80px", align: "center" };

    this.input.keyboard.on("keydown", (e) => pressedKeys.add(e.code));
    this.input.keyboard.on("keyup", (e) => pressedKeys.delete(e.code));

    const socketInitializer = async () => {
      const roomID = this.cache.text.get("roomID");
      const mode = this.cache.text.get("mode");
      userID = this.cache.text.get("userID");

      console.log("userID", userID);

      fetch("/api/socket");
      socket = io();

      socket.on("connect", () => {
        // TODO: some way to get a valid roomID
        if (mode === "play") socket.emit("join_room", roomID, userID);
        else if (mode === "spectate") socket.emit("spectate_room", roomID);
      });

      socket.on("ping", (t0) => {
        console.log("ping", performance.now() - t0);
      });

      socket.on("error", (msg) => {
        socket.disconnect();
        Router.replace(`/game?error=${msg}`, "/game");
      });

      socket.on("state", (res, serverGameStarted) => {
        state = res;

        p1 = state === 1;
        p2 = state === 2;

        switch (state) {
          case 1:
            startText.text = "Waiting for Opponent";
            break;
          case 2:
            startText.text = "Waiting for P1\nto Start the Game";
            break;
          case 3:
            startText.setVisible(!serverGameStarted);
            startText.text = "Waiting for Game to Start";
            break;
          default:
            startText.text = "who are you";
            break;
        }
        gameStarted = serverGameStarted;
      });

      socket.on("broadcast", (res) =>
        console.log("################\n", res, "\n################\n")
      );

      socket.on("ready", () => {
        ready = true;
        startText.text = p1
          ? "Press Space\nto Start Game"
          : "Waiting for P1\nto Start the Game";
      });

      socket.on("stop_game", (win) => {
        if (!gameStarted) {
          if (win === undefined) ready = false;
          return;
        }

        gameStarted = false;
        startText.visible = true;
        if (p2) startText.text = win ? "you lost" : "you won";
        else startText.text = win ? "p1 won" : "p1 lost";

        ball.setVelocity(0, 0);

        ball.x = centerX;
        ball.y = centerY;
        paddle1.y = centerY;
        paddle2.y = centerY;
      });

      socket.on("start_game", () => {
        gameStarted = true;

        const ballDir = p2 ? -1 : 1;
        ball.setVelocity(500 * ballDir, 500);

        startText.visible = false;
      });

      socket.on("moved", (movement) => {
        if (p2 === false) {
          if (movement.p1 !== undefined)
            paddle1.body.velocity.y = movement.p1 * 650;
          if (movement.p2 !== undefined)
            paddle2.body.velocity.y = movement.p2 * 650;
        }
        if (p2 === true) {
          if (movement.p1 !== undefined)
            paddle2.body.velocity.y = movement.p1 * 650;
          if (movement.p2 !== undefined)
            paddle1.body.velocity.y = movement.p2 * 650;
        }

        if (p1 === true && movement.p1 === 0) socket.emit("sync", paddle1.y, 1);
        if (p2 === true && movement.p2 === 0) socket.emit("sync", paddle1.y, 2);
      });

      socket.on("sync", (py, idx) => {
        if (p2 === true) idx = idx === 1 ? 2 : 1;

        if (idx === 1) paddle1.y = py;
        else if (idx === 2) paddle2.y = py;
      });

      socket.on("ball_sync", (newBall) => {
        ball.x = p2 ? width - newBall.pos.x : newBall.pos.x;
        ball.y = newBall.pos.y;
        ball.body.velocity.x = newBall.vel.x * (p2 ? -1 : 1);
        ball.body.velocity.y = newBall.vel.y;
      });
    };
    try {
      socketInitializer();
    } catch (e) {
      console.log(e);
    }
  }

  mouseControlPaddle = (paddle: Phaser.Physics.Arcade.Sprite, y: number) => {
    paddle.y = y;
  };

  controlPaddle = (paddle: Phaser.Physics.Arcade.Sprite, newDir: number) => {
    // console.log("befro return", newDir, paddle.body.velocity.y, state);

    if (gameStarted && !newDir) {
      newDir = Math.sign(ball.y - paddle.y);
      newDir = Math.abs(ball.y - paddle.y) > 8 ? newDir : 0;
    }
    if (dir === newDir) return;

    if (!paddle.body.velocity.y && !newDir) return;

    // paddle.setVelocityY(newDir * 650);

    socket.volatile.emit("move", newDir);

    dir = newDir;
  };

  startGame = () => {
    // first player side only
    if (!p1 || !ready) return;

    socket.emit("start_game");

    startText.visible = false;
  };

  stopGame = (win: boolean) => {
    if (!gameStarted) return;

    startText.text = win ? "you won" : "you lost";
    socket.emit("game_end", win, userID);

    gameStarted = false;
    startText.visible = true;

    ball.setVelocity(0, 0);

    ball.x = centerX;
    ball.y = centerY;
    paddle1.y = centerY;
    paddle2.y = centerY;
  };

  update() {
    this.controlPaddle(
      paddle1,
      Number(pressedKeys.has("ArrowDown")) - Number(pressedKeys.has("ArrowUp"))
    );
    if (!gameStarted) {
      if (pressedKeys.has("Space")) this.startGame();
    } else if (state !== 3) {
      if (state === 1) {
        if (ball.x < 32) {
          this.stopGame(false);
        } else if (ball.x > width - 32) {
          this.stopGame(true);
        }
      }
    }
    tickCount++;
    if (tickCount === 60) {
      tickCount = 0;

      socket.emit("ping", performance.now());
    }
  }
}
