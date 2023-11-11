import { create } from 'zustand'

type GameStateType = {
  width:number;
  height:number;
  mobile:boolean;
  ball:{
    x:number,
    y:number,
    size:number
  };
  lPaddle:number;
  rPaddle:number;
  p1Score:number;
  p2Score:number;
  ballOwner:number;
}

type GameActions = {
  setHeight  : (h: GameStateType['height']) => void;
  setWidth   : (w : GameStateType['width']) => void;
  setLPaddle : (lp : GameStateType['lPaddle']) => void;
  setRPaddle : (rp : GameStateType['rPaddle']) => void;
  setBall    : (pos : GameStateType['ball']) => void;
  setMobile  : (isMobile : GameStateType['mobile']) => void;

}

export const useGameState = create<GameStateType & GameActions>((set)=> ({
  width : 0,
  height : 0,
  mobile : false,
  ball : {x: 0,y:0,size:0},
  lPaddle : 0,
  rPaddle : 0,
  p1Score:0,
  p2Score:0,
  ballOwner:-1,
  setHeight : (h) => set(() => ({height : h})),
  setWidth : (w) => set(() => ({width : w})),
  setLPaddle : (lp) => set(() => ({lPaddle : lp})),
  setRPaddle : (rp) => set(() => ({rPaddle : rp})),
  setMobile : (isMobile ) => set(() => ({mobile:isMobile})),
  setBall : (pos) => set(() => ({ball:pos})),


}))