
export const ACTIONS = {
    UPDATE_PADDLE_KEYBOARD:"updatekeyboard",
    UPDATE_PADDLE_MOUSE:"updatemouse",
    MOVE_BALL:"moveball",
    REVERSE_X:"reversex",
    REVERSE_Y:"reversey",
    BOUNCE_EDGES:"bounceedges"
}

type ACTION_TYPE = {
    type: string;
    payload:any;
} 

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


export const reducer = (state:any , action:any) =>{
    switch (action.type) {
        case ACTIONS.UPDATE_PADDLE_MOUSE: 
            return throttlify((e :any) => {
                console.log("enter")
                const margin = (action.payload.height / 6) / 2;
                if (e.evt.layerY  <= (action.payload.height - margin) &&  e.evt.layerY >= margin)
                    return {...state , y : e.evt.layerY - margin}
                return state;
            })(action.payload.e);
        
        break;
    }
}