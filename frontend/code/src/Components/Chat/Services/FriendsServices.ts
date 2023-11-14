import api from "../../../Api/base";

export const getBlockedCall = async (
    offset: number,
    limit: number,
  
  
  ) => {
  
    try {
      const response = await api.get(`/friends/blocklist`,
        { params: { offset: offset, limit: limit } });
      console.log("blocked list response");
      console.log(response.status);
      console.log(response.data);
      return response;
    } catch (e: any) {
      console.log(e.response.data.message);
    }
  
  }

  export const unblockCall = async (
    friendId : string
  ) => {
    try {
  
      const response = await api.post("/friends/unblock", {
        friendId :friendId
      });
      console.log(response.data);
      console.log(response.status);
      return response;
    } catch (e: any) {
      console.log(e.response.data.message);
    }
  };

  export const blockUserCall  = async (
    friendId : string
  ) => {
    try {
      const response = await api.post("/friends/block", {
        friendId :friendId
      });
      console.log(response.data);
      console.log(response.status);
      return response;
      
    } catch (e : any) {
      console.log(e.response.data.message);
      
    }

  }
  
