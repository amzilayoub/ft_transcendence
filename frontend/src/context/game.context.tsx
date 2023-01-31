// import React, { createContext, useContext, useMemo } from "react";

// import pongScene from "@utils/game/scene";
// import { Socket, io } from "socket.io-client";

// const PADDLETOWALL = 48

// export interface IGameContext {
//   paddle2?: Phaser.Physics.Arcade.Sprite;
//   paddle1?: Phaser.Physics.Arcade.Sprite;
//   scene?: pongScene;
//   ball?: Phaser.Physics.Arcade.Sprite;
//   startText?: Phaser.GameObjects.Text;
//   ready: boolean;
//   gameStarted: boolean;
//   p1?: boolean;
//   p2?: boolean;
//   width?: number;
//   height?: number;
//   centerY?: number;
//   centerX?: number;
//   dir?: number;
//   socket?: Socket;
//   state?: number;
//   pressedKeys: Set<string>;
//   socketInitializer: (ctx: IGameContext) => void;
// }
// const createPaddle = (x: number, y: number) => {
//     const paddle = this.physics.add
//       .sprite(x, y, "paddle")
//       .setImmovable(true)
//       .setScale(0.5)
//       .setCollideWorldBounds(true);
//     // .setOrigin(0.5);
//     this.physics.add.collider(ball, paddle, () => {
//       if (p1) {
//         const newBall = {
//           pos: {
//             x: ball.x,
//             y: ball.y,
//           },
//           vel: {
//             x: ball.body.velocity.x,
//             y: ball.body.velocity.y,
//           },
//         };

//         socket.volatile.emit("ball_sync", newBall);
//       }
//     });
//     return paddle;
//   };
// const initialState: IGameContext = {
//   ready: false,
//   gameStarted: false,
//   pressedKeys: new Set<string>(),
  
//   socketInitializer: async ({
// 	paddle2,
// 	paddle1,
// 	scene,
// 	ball,
// 	startText,
// 	ready,
// 	gameStarted,
// 	p1,
// 	p2,
// 	width,
// 	height,
// 	centerY,
// 	centerX,
// 	dir,
// 	socket,
// 	state,
// 	pressedKeys} : IGameContext) => {
// 	  const roomID = scene?.cache.text.get("roomID");
//   const mode = scene?.cache.text.get("mode");
//   fetch("/api/socket");
//   socket = io();

//   socket.on("connect", () => {
// 	  // TODO: some way to get a valid roomID

//     if (mode === "play") socket.emit("join_room", roomID);
//     else if (mode === "spectate") socket.emit("spectate_room", roomID);
//   });
  
//   socket.on("ping", (t0) => {
//     console.log("ping", performance.now() - t0);
// });

// socket.on("error", () => {
// 	socket.disconnect();
//     Router.replace(`/game/${roomID}/spectate`);
// });

// socket.on("state", (res, serverGameStarted) => {
//     state = res;

//     p1 = state === 1;
//     p2 = state === 2;
	
//     switch (state) {
//       case 1:
//         startText.text = "Waiting for Opponent";
//         break;
// 		case 2:
// 			startText.text = "Waiting for P1\nto Start the Game";
// 			break;
// 			case 3:
// 				startText.setVisible(false);
// 				startText.text = "Waiting for Game to Start";
// 				break;
// 				default:
// 					startText.text = "who are you";
// 					break;
// 				}
// 				gameStarted = serverGameStarted;
// 			});
			
// 			socket.on("broadcast", (res) =>
// 			console.log("################\n", res, "\n################\n")
// 			);
			
// 			socket.on("ready", () => {
// 				ready = true;
// 				startText.text = p1
// 				? "Press Space\nto Start Game"
// 				: "Waiting for P1\nto Start the Game";
// 			});
			
// 			socket.on("stop_game", (win) => {
// 				if (!gameStarted) return;
				
// 				gameStarted = false;
// 				startText.visible = true;
//     if (p2) startText.text = win ? "you lost" : "you won";
//     else startText.text = win ? "p1 won" : "p1 lost";
	
//     ball.setVelocity(0, 0);
	
//     ball.x = centerX;
//     ball.y = centerY;
//     paddle1.y = centerY;
//     paddle2.y = centerY;
// });

// socket.on("start_game", () => {
// 	gameStarted = true;
	
//     const ballDir = p2 ? -1 : 1;
//     ball.setVelocity(500 * ballDir, 500);

//     startText.visible = false;
// });

// socket.on("moved", (movement) => {
// 	if (p2 === false) {
// 		if (movement.p1 !== undefined)
//         paddle1.body.velocity.y = movement.p1 * 650;
// 		if (movement.p2 !== undefined)
//         paddle2.body.velocity.y = movement.p2 * 650;
//     }
//     if (p2 === true) {
// 		if (movement.p1 !== undefined)
//         paddle2.body.velocity.y = movement.p1 * 650;
// 		if (movement.p2 !== undefined)
//         paddle1.body.velocity.y = movement.p2 * 650;
//     }
	
//     if (p1 === true && movement.p1 === 0) socket.emit("sync", paddle1.y, 1);
//     if (p2 === true && movement.p2 === 0) socket.emit("sync", paddle1.y, 2);
// });

// socket.on("sync", (py, idx) => {
// 	if (p2 === true) idx = idx === 1 ? 2 : 1;
	
//     if (idx === 1) paddle1.y = py;
//     else if (idx === 2) paddle2.y = py;
// });

// socket.on("ball_sync", (newBall) => {
// 	ball.x = p2 ? width - newBall.pos.x : newBall.pos.x;
//     ball.y = newBall.pos.y;
//     ball.body.velocity.x = newBall.vel.x * (p2 ? -1 : 1);
//     ball.body.velocity.y = newBall.vel.y;
// }),
// };
// };

// export const GameContext = createContext<IGameContext | undefined>(
//   initialState
// );

// const gameContextProvider = ({ children }: { children: React.ReactNode }) => {
// 	const value = useMemo(
// 		() => ({
// 			...initialState,
//     }),
//     []
// 	);
	
//   return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
// };

// const useGameContext = () => {
//   const context = useContext(GameContext);
//   if (context === undefined) {
//     throw new Error("useGameContext must be used within a gameContextProvider");
//   }
//   return context;
// };

// export { gameContextProvider, useGameContext };
