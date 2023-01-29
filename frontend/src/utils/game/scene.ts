// TODO: move game logic to server and send controls only

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

let socket!: Socket;
let state!: number;
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
        console.log("balls_sync");

        socket.emit("ball_sync", newBall);
      }
    });
    return paddle;
  };

  preload() {
    this.load.image("paddle", "/assets/paddle.png");
    this.load.image("ball", "/assets/small_ball.png");
  }

  create() {
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
      fetch(`/api/socket`);
      socket = io();

      socket.on("connect", () => {
        console.log("connected");
        console.log("my id: ", socket.id);

        // TODO: some way to get a valid roomID

        socket.emit("join_room", roomID);
      });

      socket.on("state", (res) => {
        state = res;

        p1 = state === 1;
        p2 = state === 2;

        if (startText === undefined) {
          console.log("starttext is undefined");

          return;
        }

        switch (state) {
          case 1:
            startText.text = "Waiting for Opponent";
            break;
          case 2:
            startText.text = "Waiting for P1\nto Start the Game";
            break;
          case 3:
            startText.text = "Waiting for Game to Start";
            break;
          default:
            startText.text = "who are you";
            break;
        }
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
        if (win === undefined) console.log("opponent disconnected?");

        if (!gameStarted) return;

        console.log("he said STOP");

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

        // let randomAng = 0 * Math.PI; // time awtes

        // console.log(randomAng);

        // // randomAng *= Math.PI;

        // console.log(Math.cos(randomAng), Math.cos(8 * Math.PI / 18));
        // randomAng = Math.cos(randomAng) < Math.cos(8 * Math.PI / 18) ? randomAng : 8 * Math.PI / 18;

        // console.log(Math.cos(randomAng), Math.cos(10 * Math.PI / 18));
        // randomAng = Math.cos(randomAng) < Math.cos(10 * Math.PI / 18) ? randomAng : 10 * Math.PI / 18;

        // console.log(Math.sin(randomAng), Math.sin(Math.PI / 4));
        // randomAng = Math.sin(randomAng) > Math.sin(Math.PI / 4) ? randomAng : (randomAng > Math.PI / 2) ? 3 * Math.PI / 4 : Math.PI / 4;

        // // randomAng *= Math.random() > .5 ? 1 : -1;

        // ball.setVelocity(600 * Math.sin(randomAng) * ballDir, 600 * Math.cos(randomAng));
        // setTimeout(() => this.stopGame(), 700);

        // gameState = {
        //   p1: {
        //     pos: { y: paddle1.y },
        //     vel: { y: paddle1.body.velocity.y },
        //   },
        //   p2: {
        //     pos: { y: paddle2.y },
        //     vel: { y: paddle2.body.velocity.y },
        //   },
        //   ball: {
        //     pos: {
        //       x: ball.x,
        //       y: ball.y,
        //     },
        //     vel: {
        //       x: ball.body.velocity.x,
        //       y: ball.body.velocity.y,
        //     },
        //   },
        // };

        startText.visible = false;
        // startText.text = "Press Space\nto Start Game";
      });

      socket.on("moved", (movement) => {
        if (p2 === false) {
          //p1 && spectator
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

        if (p1 === true && movement.p1 === 0) {
          socket.emit("sync", paddle1.y, 1);
        }
        if (p2 === true && movement.p2 === 0) {
          socket.emit("sync", paddle1.y, 2);
        }
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

    socketInitializer();
  }

  mouseControlPaddle = (paddle: Phaser.Physics.Arcade.Sprite, y: number) => {
    paddle.y = y;
  };

  controlPaddle = (paddle: Phaser.Physics.Arcade.Sprite, dir: number) => {
    // console.log("befro return", dir, paddle.body.velocity.y, state);

    if (p2 && !dir) {
      dir = Math.sign(ball.y - paddle.y);
      dir = Math.abs(ball.y - paddle.y) > 16 ? dir : 0;
    }

    if (!paddle.body.velocity.y && !dir) return;

    // paddle.setVelocityY(dir * 650);

    socket.emit("move", dir);
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
    socket.emit("game_end", win);
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
    } else if (state === 1) {
      if (ball.x < 32) {
        this.stopGame(false);
      } else if (ball.x > width - 32) {
        this.stopGame(true);
      }
      // if (p1) {
      //   console.log(gameStarted);

      //   tickCount++;
      //   if (tickCount === 20) {
      //     tickCount = 0;

      //     const gameState = {
      //       p1: {
      //         pos: { y: paddle1.y },
      //         vel: { y: paddle1.body.velocity.y },
      //       },
      //       p2: {
      //         pos: { y: paddle2.y },
      //         vel: { y: paddle2.body.velocity.y },
      //       },
      //       ball: {
      //         pos: {
      //           x: ball.x,
      //           y: ball.y,
      //         },
      //         vel: {
      //           x: ball.body.velocity.x,
      //           y: ball.body.velocity.y,
      //         },
      //       },
      //     };

      //     socket.emit("ball_sync", gameState);
      //   }
      // }
    }
  }
}
