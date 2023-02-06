import Router from "next/router";
import { Scene } from "phaser";
import { io, Socket } from "socket.io-client";

const defaultPaddleSpeed = 550;
const defaultBallSpeed = 400;
const defaultScale = 0.5;
let ballSpeed = defaultBallSpeed;
let paddleSpeed = defaultPaddleSpeed;
let scale = defaultScale;

let paddle2!: Phaser.Physics.Arcade.Sprite;
let paddle1!: Phaser.Physics.Arcade.Sprite;
let ball!: Phaser.Physics.Arcade.Sprite;
let powerUp!: Phaser.Physics.Arcade.Sprite;

let startText!: Phaser.GameObjects.Text;
let pingText!: Phaser.GameObjects.Text;
let myScore!: Phaser.GameObjects.Text;
let opponentScore!: Phaser.GameObjects.Text;
let powerUpCD!: Phaser.GameObjects.Text;

let effect!: string;
const effects = ["invis", "speed", "bigg", "bamboozle"];

let triggered: boolean = false;
let ready: boolean = false;
let powerUpMode: boolean = false;
let gameStarted: boolean = false;
let midGame: boolean = false;
let scored: boolean = false;
let p1!: boolean;
let p2!: boolean;

let lastTime!: number;
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

export class pongScene extends Scene {
  public socket!: Socket;
  createPaddle = (x: number, y: number) => {
    const paddle = this.physics.add
      .sprite(x, y, "paddle")
      .setImmovable(true)
      .setScale(scale)
      .setCollideWorldBounds(true)
      .setOrigin(0.5, 0.5);
    // .setOrigin(0.5, 0.5);
    this.physics.add.collider(ball, paddle, () => {
      if (p1) {
        const MIN_ANGLE = Math.PI / 10;
        const MAX_ANGLE = (Math.PI * 4) / 10;

        // Generate a random angle within the range

        // //console.log(ball.body.velocity.x > 0 ? 0 : 1);
        let angle =
          MIN_ANGLE +
          Math.random() * (MAX_ANGLE - MIN_ANGLE) +
          Math.PI * (ball.body.velocity.x > 0 ? 0 : 1);
        // //console.log(ball.body.velocity.angle(), angle);

        ball.setVelocity(
          Math.cos(angle) * ballSpeed,
          Math.sin(angle) * ballSpeed * (paddle.body.velocity.y > 0 ? 1 : -1)
        );
        const newBall = {
          x: ball.x,
          y: ball.y,
          vx: ball.body.velocity.x,
          vy: ball.body.velocity.y,
        };

        socket.emit("ball_sync", newBall, true);
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
      if (p1 || p2) {
        ready = false;
        socket.emit("not_ready");
      }
    });

    this.game.events.on("resume", () => {
      if (p1 || p2) {
        ready = true;
        socket.emit("ready");
      }
    });
    width = this.game.canvas.width;
    height = this.game.canvas.height;
    centerX = width / 2;
    centerY = height / 2;

    this.add
      .graphics()
      .lineStyle(2, 0x999999, 1)
      .lineBetween(centerX, 0, centerX, height)
      .setVisible(true);

    ball = this.physics.add
      .sprite(centerX, centerY, "ball")
      .setCollideWorldBounds(true)
      .setScale(scale)
      .setBounce(1, 1)
      .setOrigin(0.5, 0.5);
    startText = this.add
      .text(centerX, centerY / 2, "", {
        fontSize: "40px",
        align: "center",
      })
      .setOrigin(0.5, 0.5);
    myScore = this.add
      .text(centerX / 4, centerY / 6, "0", {
        fontSize: "80px",
        color: "#999999",
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false);
    opponentScore = this.add
      .text((7 * centerX) / 4, centerY / 6, "0", {
        fontSize: "80px",
        color: "#999999",
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false);

    powerUpCD = this.add
      .text(centerX, centerY / 6, "0.0", {
        fontSize: "20px",
        color: "#999999",
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false);

    pingText = this.add
      .text((15 * centerX) / 8, centerY / 12, "ping: -ms", {
        fontSize: "16px",
        align: "center",
        color: "#00dd00",
      })
      .setOrigin(0.5, 0.5)
      .setVisible(true);

    paddle1 = this.createPaddle(48, centerY);
    paddle2 = this.createPaddle(width - 48, centerY);

    this.input.keyboard.on("keydown", (e) => pressedKeys.add(e.code));
    this.input.keyboard.on("keyup", (e) => pressedKeys.delete(e.code));

    const socketInitializer = async () => {
      userID = this.cache.text.get("userID");

      fetch("/api/socket");
      socket = io();
      this.socket = socket;
      const applyMode = (mode: string) => {
        if (mode === "classic") {
          paddle1.setScale(scale);
          paddle2.setScale(scale);
          ball.setScale(scale);
          ballSpeed = defaultBallSpeed;
          paddleSpeed = defaultPaddleSpeed;
        } else if (mode === "blitz") {
          paddle1.setScale(0.35);
          paddle2.setScale(0.35);
          ball.setScale(0.35);
          ballSpeed = 600;
          paddleSpeed = 750;
        } else if (mode === "powerUp") {
          paddle1.setScale(scale);
          paddle2.setScale(scale);
          ball.setScale(scale);
          ballSpeed = defaultBallSpeed;
          paddleSpeed = defaultPaddleSpeed;
          powerUpMode = true;
          powerUp = this.physics.add
            .sprite(centerX, centerY, "ball")
            .setVisible(false);

          this.physics.add.overlap(ball, powerUp, () => {
            if (powerUp.visible) triggered = true;
          });
        }
      };
      socket.on("connect", () => {
        const roomID = this.cache.text.get("roomID");
        const mode = this.cache.text.get("mode");
        if (mode === "spectate") socket.emit("spectate_room", roomID, userID);
        else {
          applyMode(mode);
          socket.emit(
            "join_room",
            roomID,
            userID,
            mode,
            this.cache.text.get("username"),
            this.cache.text.get("avatar_url")
          );
        }
      });

      socket.on("ping", (t0) => {
        let ping = performance.now() - t0;
        ping = ping > 999 ? 999 : ping;
        pingText.text = `ping: ${ping.toFixed()}ms`;
      });

      socket.on("score", (tally) => {
        if (p2) {
          myScore.text = tally.p2.score.toString();
          opponentScore.text = tally.p1.score.toString();
        } else {
          myScore.text = tally.p1.score.toString();
          opponentScore.text = tally.p2.score.toString();
        }
        midGame = false;
        scored = false;
        this.newRound();
      });

      socket.on("ready", () => {
        ready = true;
        startText.text = p1
          ? "Press Space\nto Start Game"
          : "Waiting for P1\nto Start the Game";
      });

      socket.on("not_ready", () => {
        ready = false;
      });

      socket.on("error", (msg) => {
        socket.disconnect();
        Router.replace(`/home?error=${msg}`, "/home");
      });

      socket.on("state", (res, serverGameStarted, mode, p1Score, p2Score) => {
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
            applyMode(mode);
            myScore.text = (p1Score || 0).toString();
            opponentScore.text = (p2Score || 0).toString();
            this.switchUI(serverGameStarted);
            startText.text = "Waiting for Game to Start";
            break;
          default:
            startText.text = "who are you";
            break;
        }
        gameStarted = serverGameStarted;
      });

      socket.on("stop_game", (win) => {
        if (!gameStarted) return;

        gameStarted = false;
        midGame = false;

        this.switchUI(gameStarted);
        // //console.log("stop_game", win);

        if (p2 || p1)
          startText.text = (win && p2) || (!win && p1) ? "you lost" : "you won";
        else startText.text = win ? "p1 won" : "p1 lost";

        myScore.text = "0";
        opponentScore.text = "0";

        this.newRound();
      });

      socket.on("start_game", (velocity) => {
        gameStarted = true;
        midGame = true;

        const ballDir = p2 ? -1 : 1;

        ball.setVelocity(
          ballSpeed * velocity.x * ballDir,
          ballSpeed * velocity.y
        );

        this.switchUI(gameStarted);
      });

      socket.on("moved", (movement) => {
        if (p2 === false) {
          if (movement.p1 !== undefined)
            paddle1.body.velocity.y = movement.p1 * paddleSpeed;
          if (movement.p2 !== undefined)
            paddle2.body.velocity.y = movement.p2 * paddleSpeed;
        }
        if (p2 === true) {
          if (movement.p1 !== undefined)
            paddle2.body.velocity.y = movement.p1 * paddleSpeed;
          if (movement.p2 !== undefined)
            paddle1.body.velocity.y = movement.p2 * paddleSpeed;
        }

        if (p1 === true && movement.p1 === 0) socket.emit("sync", paddle1.y, 1);
        if (p2 === true && movement.p2 === 0) socket.emit("sync", paddle1.y, 2);
      });

      socket.on("sync", (py, idx) => {
        if (p2 === true) idx = idx === 1 ? 2 : 1;

        if (idx === 1) paddle1.y = py;
        else if (idx === 2) paddle2.y = py;
      });

      socket.on("ball_sync", (newBall, touch) => {
        //clear effects
        console.log(touch);
        
        if (powerUpMode && touch) {
          // ballSpeed = defaultBallSpeed;
          paddle1.setScale(scale);
          paddle2.setScale(scale);
          ball.setScale(scale).setAlpha(1);
        }
        ball.setX(p2 ? width - newBall.x : newBall.x);
        ball.setY(newBall.y);
        ball.setVelocityX(newBall.vx * (p2 ? -1 : 1));
        ball.setVelocityY(newBall.vy);
      });

      socket.on("powerup", (serverPowerUp) => {
        //console.log("powerup", serverPowerUp);
        powerUp.setX(p2 ? width - serverPowerUp.x : serverPowerUp.x);
        powerUp.setY(serverPowerUp.y);
        powerUp.setVisible(true);
        effect = serverPowerUp.effect;

        if (effect === "speed") {
          powerUp.setTint(0xb52121);
        } else if (effect === "bigg") {
          powerUp.setTint(0x5fc918);
        } else if (effect === "invis") {
          powerUp.setAlpha(0.25);
        } else if (effect === "bamboozle") {
          powerUp.setTint(0x56aee8);
        }
      });
    };
    try {
      socketInitializer();
    } catch (e) {
      //console.log(e);
    }
  }

  mouseControlPaddle = (paddle: Phaser.Physics.Arcade.Sprite, y: number) => {
    paddle.y = y;
  };

  switchUI = (gaming: boolean) => {
    startText.setVisible(!gaming);
    myScore.setVisible(gaming);
    opponentScore.setVisible(gaming);
  };

  newRound = () => {
    ball.setVelocity(0, 0);

    ball.setX(centerX);
    ball.setY(centerY);

    triggered = false;
    if (powerUpMode) {
      powerUp.setVisible(false);
      powerUp.clearAlpha();
      powerUp.clearTint();

      paddle1.setScale(scale);
      paddle2.setScale(scale);
      ball.setScale(scale).setAlpha(1);

      lastTime = 0;
    }
    dir = 0;
    paddle1.setVelocityY(0);
    paddle1.setY(centerY);
    paddle2.setVelocityY(0);
    paddle2.setY(centerY);
  };

  controlPaddle = (paddle: Phaser.Physics.Arcade.Sprite, newDir: number) => {
    // if (gameStarted && p2 && !newDir) {
    //   newDir = Math.sign(ball.y - paddle.y);
    //   newDir = Math.abs(ball.y - paddle.y) > 8 ? newDir : 0;
    // }
    if (dir === newDir) return;

    if (!paddle.body.velocity.y && !newDir) return;

    socket.emit("move", newDir);

    dir = newDir;
  };

  startGame = () => {
    // first player side only
    if (!p1 || !ready) return;

    // Set the minimum and maximum angle range
    const MIN_ANGLE = Math.PI / 10;
    const MAX_ANGLE = (Math.PI * 4) / 10;

    // Generate a random angle within the range
    let angle = MIN_ANGLE + Math.random() * (MAX_ANGLE - MIN_ANGLE);
    let velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle) * (Math.random() > 0.5 ? 1 : -1),
    };
    socket.emit("start_game", velocity);
  };

  score = (myGoal: boolean) => {
    scored = true;
    socket.emit("score", myGoal, userID);
  };

  update(time: number) {
    if (!gameStarted || !midGame) {
      // midGame should only when gameStarted
      if (pressedKeys.has("Space")) this.startGame();
    }
    if (gameStarted) {
      if (state !== 3) {
        this.controlPaddle(
          paddle1,
          Number(pressedKeys.has("ArrowDown")) -
            Number(pressedKeys.has("ArrowUp"))
        );
      }
      if (state === 1 && !scored) {
        //console.log(paddle1.x, paddle2.x);

        if (ball.x < ball.body.halfWidth + paddle1.x + paddle1.body.halfWidth) {
          this.score(false);
        } else if (
          ball.x >
          paddle2.x - paddle2.body.halfWidth - ball.body.halfWidth
        ) {
          this.score(true);
        }
      }
      if (powerUpMode) {
        if (triggered) {
          triggered = false;
          powerUp.setVisible(false);
          powerUp.clearAlpha();
          powerUp.clearTint();
          if (effect === "speed") {
            ball.setVelocity(ball.body.velocity.x * 2.5, ball.body.velocity.y);
          } else if (effect === "bigg") {
            paddle1.setScale(1);
            paddle2.setScale(1);
          } else if (effect === "invis") {
            ball.setAlpha(0.1);
          } else if (effect === "bamboozle") {
            ball.setVelocityY(ball.body.velocity.y * -1);
          }
          lastTime = time;
        } else if (p1 && gameStarted && midGame) {
          lastTime = lastTime || time;

          if (time - lastTime >= 5000 && !powerUp.visible) {
            //console.log("powerup");

            socket.emit("powerup", {
              effect:
                effects[
                  Math.floor(Math.random() * effects.length) % effects.length
                ],
              x: Math.random() * (width - 192) + 96,
              y: Math.random() * (height - 192) + 96,
            });
            lastTime = time;
          }
        }
      }
    }
    tickCount++;
    if (tickCount === 60) {
      tickCount = 0;
      if (p1) {
        let newBall = {
          x: ball.x,
          y: ball.y,
          vx: ball.body.velocity.x,
          vy: ball.body.velocity.y,
        };
        socket.emit("ball_sync", newBall, false);

      }

      socket.emit("ping", performance.now());
    }
  }
}
