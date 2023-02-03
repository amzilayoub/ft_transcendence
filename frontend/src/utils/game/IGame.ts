export interface IGame {
  roomID: string;
  p1:
    | {
        userID: string;
        score: number;
        socketID: string;
      }
    | undefined;
  p2:
    | {
        userID: string;
        score: number;
        socketID: string;
      }
    | undefined;

  spectators: {
    socketID: string;
    userID: string;
  }[];

  gameReady: boolean;
  gameStarted: boolean;
  mode: string | undefined;
}
