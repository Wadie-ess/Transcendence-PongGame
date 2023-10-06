import { useEffect , useState} from "react"
import { Rect, Stage , Layer , Circle, Line} from "react-konva"
import { BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill} from "react-icons/bs";
import { useUserStore } from "../../Stores/stores";
import { useGameState } from "./States/GameState";

const DURATION = 20;
type  ball ={
  x:number,
  y:number,
  speed:number,
  cx:number,
  cy:number,
};
const throttle = (function() {
  let timeout:any = undefined;
  return function throttle(callback:any) {
    if (timeout === undefined) {
      callback();
      timeout = setTimeout(() => {
        timeout = undefined;
      }, DURATION);
    }
  }
})();


function throttlify(callback : any) {
  return function throttlified(event :any) {
    throttle(() => {
      callback(event);
    });
  }
}

export const Game = () => {
    const gameState = useGameState();
    const user = useUserStore();    
    const [first , setFirest] = useState(false)
    const handleMove = throttlify((e :any) => {

        const margin = (gameState.height / 6) / 2;
        if (e.evt.layerY  <= (gameState.height - margin) &&  e.evt.layerY >= margin)
        gameState.setLPaddle(e.evt.layerY - margin)
    })
    // useEffect(() => {
      
      
    // },[gameState.height, gameState.width])
    useEffect(() => {
        window.addEventListener('resize', () => {
            const divh = document.getElementById('Game')?.offsetHeight
            const divw = document.getElementById('Game')?.offsetWidth
            if (divh) gameState.setHeight(divh);
            if (divw) gameState.setWidth(divw);
            if (divh) gameState.setLPaddle(divh / 2)
        });
        if(gameState.p1Score === 0 && gameState.p2Score === 0) {
          gameState.setBall({x:0.5 * gameState.width,y:0.5 * gameState.height,speed:0,cx:gameState.height /100,cy:gameState.height /100})
        }
    },[])

    useEffect(() => {
        const divh = document.getElementById('Game')?.offsetHeight
        const divw = document.getElementById('Game')?.offsetWidth
        if (divh) gameState.setHeight(divh);
        if (divw) gameState.setWidth(divw);
        if (divh && divw){
          if (first === false)
          {
            setFirest(true)
            gameState.setBall({x:0.5 * divw,y:0.5 * divh,speed:0,cx:gameState.height /100,cy:gameState.height /100})
          }
          const newx:number = (divw * gameState.ball.x) / gameState.width; 
          const newy:number =  (divh * gameState.ball.y) / gameState.height;
            console.log(`${divw} ${gameState.ball.x} ${gameState.height}`)
          const n :ball = { x:newx , y:newy , speed:0, cx:divw / 100,cy:divh / 100}
          console.log(n)
          if(n.x)
            gameState.setBall(n)
          divw <= 742 ? gameState.setMobile(true) : gameState.setMobile(false)
          console.log("old game")
          console.log(gameState)

          const oldinter = setInterval(() => {
            let newball = gameState.ball;
            if (newball.x +gameState.width / 40 > divw || newball.x - gameState.width / 40 < 0)
              newball.cx *= -1
            if (newball.y +gameState.width / 40> divh || newball.y - gameState.width / 40< 0)
              newball.cy *= -1
            if (Math.hypot((newball.x + newball.cx ) - (gameState.lPaddle) , (newball.y + newball.cy) - gameState.lPaddle) < 0)
              newball.cx *= -1
            console.log(Math.hypot((newball.x + newball.cx ) - (gameState.lPaddle) , (newball.y + newball.cy) - gameState.lPaddle))
            console.log(gameState.lPaddle)

            newball.x += newball.cx;
            newball.y += newball.cy;
            gameState.setBall(newball)
              // clearInterval(oldinter)
          },150);
          return () => clearInterval(oldinter)
      }
    },[gameState.width , gameState.height])
    console.log(gameState.lPaddle)
    return ( 
    <div className="flex flex-col gap-10 justify-start md:justify-center md:items-center items-center pt-12 md:pt-0  h-full w-full" >
        <div className="flex items-center justify-center gap-x10 w-full xl:pt-4">
            <div className="flex items-center justify-center w-1/4 gap-6">
                <img className="rounded-full w-auto h-auto max-w-[10vw] md:max-w-[20vw]" src={user.picture.medium} />
                <span className="font-lexend font-extrabold text-[4vw] xl:text-[2vw] text-current">1</span>
            </div>
            <div className="flex items-center justify-center w-1/4 gap-6">
                <span className="font-lexend font-extrabold text-[4vw] xl:text-[2vw] text-current">5</span>
                <img className="rounded-full w-auto h-auto max-w-[10vw] md:max-w-[20vw]" src={user.picture.medium} />
            </div>
        </div>
        <div className="flex items-center justify-center min-h-16 max-h-[80%] max-w-[90%] min-w-16 w-[95%] rounded-xl aspect-video border-primary border-4" id="Game">
            <Stage onMouseMove={handleMove}  width={gameState.width - 12} height={gameState.height - 12}  >
                <Layer >
                    <Rect height={gameState.height} width={gameState.width} fill="#151B26" x={0} y={0} />
                    <Line points={[0, gameState.height , 0 , 0]} dash={[gameState.height / 30 , 10]} strokeWidth={2} stroke={"white"} height={gameState.height} width={20} fill="white" x={gameState.width / 2} y={0}  />
                    <Rect cornerRadius={12} height={gameState.height / 6} width={gameState.width / 70} x={10} y={gameState.lPaddle} fill="white" />
                    <Rect cornerRadius={12} height={gameState.height / 6} width={gameState.width / 70} x={gameState.width - 20 - (gameState.width / 70)} y={gameState.height  / 3} fill="white" />
                    <Circle fill="white" height={gameState.width / 40} width={gameState.width / 40} x={gameState.ball.x} y={gameState.ball.y} />
                </Layer>

            </Stage>
            
        </div>
        {gameState.mobile && (
        <div className="flex justify-around items-center w-full gap-20">
            <BsFillArrowLeftCircleFill className="w-14 h-14 hover:cursor-pointer hover:fill-secondary hover:transition-colors delay-100 "/>
            <BsFillArrowRightCircleFill  className="w-14 h-14 hover:cursor-pointer hover:fill-secondary hover:transition-colors delay-100"/>
        </div>
    )
        
        }
    </div>

    )
} 