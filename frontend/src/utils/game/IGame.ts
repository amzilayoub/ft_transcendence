interface IPlayer {
    userID: string;
    username: string;
    avatar_url: string;
    score: number;
    socketID: string;
  }

export interface IGame {
  roomID: string;
  p1: IPlayer | undefined;
  p2: IPlayer | undefined;
  spectators: Partial<IPlayer>[];
  gameReady: boolean;
  gameStarted: boolean;
  mode: "classic" | "blitz" | "powerUp" | undefined;
}
