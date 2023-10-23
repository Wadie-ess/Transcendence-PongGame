import api  from "../../../Api/base";


export const createNewRoomCall = async (
    name: string,
    type: string,
    password?: string
  ) => {
    try {
    
      const response = await api.post("/rooms/create", {
        name: name,
        type: type,
        password: password,
      });
      console.log(response.data);
      console.log(response.status);
      return response;
    } catch (e) {
      console.log(e);
    }
  };


  export const updateRoomCall = async (
    name: string,
    type: string,
    roomId: string,
    password? : string,

  ) => {
    try {
    
      const response = await api.post("/rooms/update", {
        name: name,
        type: type,
        roomId : roomId, 
        password : password,
      });
      console.log(response.data);
      console.log(response.status);
      return response;
    } catch (e) {
      console.log(e);
    }

   };


   export  const fetchRoomsCall  = async (
    offset: number,
    limit : number,
    joined : boolean,

   ) => {

    try {
      const response = await api.get(`/rooms`,
      { params: { offset: offset, limit : limit, joined : joined  } });
      joined === true ?  console.log("resent :") : console.log("Public :");
      console.log(response.status);
      console.log(response.data);
      return response;
    } catch (e) {
      console.log(e);
    }


    



   }



   export const getRoomMembersCall = async (
     id : string,
     offset: number,
     limit : number,
   ) => {
    try {
      const response = await api.get(`/rooms/${id}/members`,
      { params: {offset: offset, limit : limit  } });
      console.log("room members :");
      console.log(response.status);
      console.log(response.data);
      return response;
    } catch (e) {
      console.log(e);
    }

   }


   export const joinRoomCall  = async (
    roomId : string,
    password? : string,

   ) => {
    try {
    
      const response = await api.post("/rooms/join", {
        roomId : roomId,
        password : password,
      });
      console.log("join room")
      console.log(response.status);
      console.log(response.data);
      return response;
    } catch (e : any)  {
      console.log(e.response.data.message);
    }
   }