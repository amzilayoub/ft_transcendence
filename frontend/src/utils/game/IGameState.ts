export interface IGameState {
  p1: {
    pos: {
      y: number;
    };
    vel: {
      y: number;
    };
  };
  p2: {
    pos: {
      y: number;
    };
    vel: {
      y: number;
    };
  };
  ball: {
    pos: {
      x: number;
      y: number;
    };
    vel: {
      x: number;
      y: number;
    };
  };
}
