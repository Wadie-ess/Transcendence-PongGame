import { create } from "zustand";

type GameStateType = {
  width: number;
  height: number;
  mobile: boolean;
  ball: {
    x: number;
    y: number;
    size: number;
    p1Score: number;
    p2Score: number;
  };
  lPaddle: number;
  rPaddle: number;
  ballOwner: number;
  p1: any;
  p2: any;
  side: boolean;
  end: boolean;
};

type GameActions = {
  setHeight: (h: GameStateType["height"]) => void;
  setWidth: (w: GameStateType["width"]) => void;
  setLPaddle: (lp: GameStateType["lPaddle"]) => void;
  setRPaddle: (rp: GameStateType["rPaddle"]) => void;
  setBall: (pos: GameStateType["ball"]) => void;
  setMobile: (isMobile: GameStateType["mobile"]) => void;
  setP1: (p1: GameStateType["p1"]) => void;
  setP2: (p2: GameStateType["p2"]) => void;
  setSide: (side: GameStateType["side"]) => void;
  setEnd: (end: GameStateType["end"]) => void;
};

export const useGameState = create<GameStateType & GameActions>((set) => ({
  width: 0,
  height: 0,
  mobile: false,
  ball: { x: 0, y: 0, size: 0, p1Score: 0, p2Score: 0 },
  lPaddle: 0,
  rPaddle: 0,
  ballOwner: -1,
  p1: null,
  p2: null,
  side: false,
  end: true,
  setHeight: (h) => set(() => ({ height: h })),
  setWidth: (w) => set(() => ({ width: w })),
  setLPaddle: (lp) => set(() => ({ lPaddle: lp })),
  setRPaddle: (rp) => set(() => ({ rPaddle: rp })),
  setMobile: (isMobile) => set(() => ({ mobile: isMobile })),
  setBall: (pos) => set(() => ({ ball: pos })),
  setP1: (p1) => set(() => ({ p1: p1 })),
  setP2: (p2) => set(() => ({ p2: p2 })),
  setSide: (side) => set(() => ({ side: side })),
  setEnd: (end) => set(() => ({ end: end })),
}));
