import { useEffect , useState , useReducer} from "react"
import { Rect, Stage , Layer , Circle, Line} from "react-konva"
import { BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill} from "react-icons/bs";
import { useUserStore } from "../../Stores/stores";

// const randomBallDirection = () => {
//     const direction = Math.round(Math.random() * 2)
//     direction >= 1 ? true : false 
// }
const DURATION = 16;

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

    const user = useUserStore();    
    const [width , setWidth] = useState(0);
    const [height , setHeight] = useState(0)
    const [mobile , setMobile] = useState(false)
    const [paddlePos , setPaddlePos] = useState(0)
    const [ball , setBall] = useState(0);
    const handleMove = throttlify((e :any) => {

        const margin = (height / 6) / 2;
        if (e.evt.layerY  <= (height - margin) &&  e.evt.layerY >= margin)
            setPaddlePos(e.evt.layerY - margin)
    })
    
    useEffect(() => {
        window.addEventListener('resize', () => {
            const divh = document.getElementById('Game')?.offsetHeight
            const divw = document.getElementById('Game')?.offsetWidth
            if (divh) setHeight(divh);
            if (divw) setWidth(divw);
            if (divh) setPaddlePos(divh / 2)
        });
    },[])

    useEffect(() => {
        const divh = document.getElementById('Game')?.offsetHeight
        const divw = document.getElementById('Game')?.offsetWidth
        if (divh) setHeight(divh);
        if (divw) setWidth(divw);
        console.log(`h ${height} w ${width}`)
        width <= 742 ? setMobile(true) : setMobile(false)
    },[width , height])

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
            <Stage onMouseMove={handleMove} width={width - 12} height={height - 12}  >
                <Layer >
                    <Rect height={height} width={width} fill="#151B26" x={0} y={0} />
                    <Line points={[0, height , 0 , 0]} dash={[height / 30 , 10]} strokeWidth={2} stroke={"white"} height={height} width={20} fill="white" x={width / 2} y={0}  />
                    <Rect cornerRadius={12} height={height / 6} width={width / 70} x={10} y={paddlePos} fill="white" />
                    <Rect cornerRadius={12} height={height / 6} width={width / 70} x={width - 20 - (width / 70)} y={height  / 3} fill="white" />
                    <Circle fill="white" height={width / 40} width={width / 40} x={width/2} y={height / 2} />
                </Layer>

            </Stage>
            
        </div>
        {mobile && (
        <div className="flex justify-around items-center w-full gap-20">
            <BsFillArrowLeftCircleFill className="w-14 h-14 hover:cursor-pointer hover:fill-secondary hover:transition-colors delay-100 "/>
            <BsFillArrowRightCircleFill  className="w-14 h-14 hover:cursor-pointer hover:fill-secondary hover:transition-colors delay-100"/>
        </div>
    )
        
        }
    </div>

    )
} 