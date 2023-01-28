// TODO: move game logic to server and send controls only

import { Scene } from "phaser";
import { io, Socket } from "socket.io-client";

import { IGameState } from "./IGameState";

let paddle2!: Phaser.Physics.Arcade.Sprite;
let paddle1!: Phaser.Physics.Arcade.Sprite;
let ball!: Phaser.Physics.Arcade.Sprite;

let startText!: Phaser.GameObjects.Text;

let gameStarted: boolean = false;
let T0!: number;
let p1!: boolean;
let p2!: boolean;

let width!: number;
let height!: number;

let centerY!: number;
let centerX!: number;

let socket!: Socket;
let gameState!: IGameState;
let state!: string;
let pressedKeys = new Set<string>();

export default class pongScene extends Scene {
  createPaddle = (x: number, y: number) => {
    const paddle = this.physics.add
      .sprite(x, y, "paddle")
      .setImmovable(true)
      .setScale(0.5)
      .setCollideWorldBounds(true);
    // .setOrigin(0.5);
    this.physics.add.collider(ball, paddle, () =>
      console.log(ball.body.velocity.x, ball.body.velocity.y)
    );
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
        if (state === "gaming") {
          return;
        }
        state = res;
        
        if (p1 === undefined) {
          p1 = state === "wait";
          p2 = state === "gaming";
        }
        if (startText === undefined) {
          console.log('starttext is undefined');
          
          return;
        }
        console.log(state);
        
        switch (state) {
          case "wait":
            console.log("haaaaaaaaaaaaaaaaa");
            
            startText.text = "Waiting for Opponent";
            break;
            case "gaming":
              startText.text = p1
              ? "Press Space\nto Start Game"
              : "Waiting for P1\nto Start the Game";
              break;
          case "spectate":
            if (p1 === p2) startText.text = "Waiting for Game to Start";
            break;
            default:
              startText.text = "who are you";
              break;
            }
          });
          
          socket.on("broadcast", (res) =>
          console.log("################\n", res, "\n################\n")
          );
          
          socket.on("stop_game", (res) => {
            if (!gameStarted) return;
            gameStarted = false;
            startText.visible = true;

            ball.setVelocity(0, 0);

            ball.x = centerX;
            ball.y = centerY;
            paddle1.y = centerY;
            paddle2.y = centerY;
          }
          );
          
          socket.on("start_game", () => {
            gameStarted = true;
            
            const ballDir = p2 ? -1 : 1;
        ball.setVelocity(500 * ballDir, 500);
  
        gameState = {
          p1: {
            pos: { y: paddle1.y },
            vel: { y: paddle1.body.velocity.y },
          },
          p2: {
            pos: { y: paddle2.y },
            vel: { y: paddle2.body.velocity.y },
          },
          ball: {
            pos: {
              x: ball.x,
              y: ball.y,
            },
            vel: {
              x: ball.body.velocity.x,
              y: ball.body.velocity.y,
            },
          },
        };
        
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
    };
  
    socketInitializer();
  }
  
  mouseControlPaddle = (paddle: Phaser.Physics.Arcade.Sprite, y: number) => {
    paddle.y = y;
  };
  
  controlPaddle = (paddle: Phaser.Physics.Arcade.Sprite, dir: number) => {
    // console.log("befro return", dir, paddle.body.velocity.y, state);
    
    if (!paddle.body.velocity.y && !dir) return;

    // paddle.setVelocityY(dir * 650);

    socket.emit("move", dir);
  };

  startGame = () => {
    // first player side only
    if (!p1 || state !== "gaming") return;

    socket.emit("start_game");
    startText.visible = false;
  };

  stopGame = () => {
    if (!gameStarted) return;
    gameStarted = false;
    startText.visible = true;

    ball.setVelocity(0, 0);

    ball.x = centerX;
    ball.y = centerY;
    paddle1.y = centerY;
    paddle2.y = centerY;
  };

  update() {
    if (!gameStarted && pressedKeys.has("Space")) {
      this.startGame();
    } else {
      // if (this.escKey.isDown) this.stopGame();
      // console.log(pressedKeys);

      // if (ball.body.velocity.x > 0 && ball.x > width / 2) { // npc
      //   this.mouseControlPaddle(
      //     paddle2,
      //     Math.sign(ball.y - paddle2.y) *
      //       Number(Math.abs(ball.y - paddle2.y) > 32) // paddle2.height / 2 == 32
      //   );
      // } 

      if (ball.x < 32) {
        if (!(p1 || p2)) startText.text = "p2 won";
        else startText.text = "you lost";
        this.stopGame();
      } else if (ball.x > width - 32) {
        if (!(p1 || p2)) startText.text = "p1 won";
        else startText.text = "you won";
        this.stopGame();
      }
      this.controlPaddle(
        paddle1,
        Number(pressedKeys.has("ArrowDown")) -
          Number(pressedKeys.has("ArrowUp"))
      );
    }
  }
}
