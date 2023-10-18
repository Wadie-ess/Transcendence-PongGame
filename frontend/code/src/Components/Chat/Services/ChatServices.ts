import { api } from "../../../Api/base";

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

  ) => {
    try {
    
      const response = await api.post("/rooms/update", {
        name: name,
        type: type,
        roomId : roomId
      });
      console.log(response.data);
      console.log(response.status);
      return response;
    } catch (e) {
      console.log(e);
    }

   };