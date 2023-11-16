import toast from "react-hot-toast";
import api from "../../../Api/base";

export const createNewRoomCall = async (
  name: string,
  type: string,
  password?: string,
  secondMember?: string,
) => {
  try {
    const response = await api.post("/rooms/create", {
      name: name,
      type: type,
      password: password,
      secondMember: secondMember,
    });
    return response;
  } catch (e: any) {
    return e?.response;
  }
};

export const updateRoomCall = async (
  name: string,
  type: string,
  roomId: string,
  password?: string,
) => {
  try {
    const response = await api.post("/rooms/update", {
      name: name,
      type: type,
      roomId: roomId,
      password: password,
    });
    return response;
  } catch (e: any) {
    toast.error(e.response.data.message);
  }
};

export const fetchRoomsCall = async (
  offset: number,
  limit: number,
  joined: boolean,
) => {
  try {
    const response = await api.get(`/rooms`, {
      params: { offset: offset, limit: limit, joined: joined },
    });
    return response;
  } catch (e: any) {
    // Do nothing
  }
};

export const fetchDmsCall = async (offset: number, limit: number) => {
  try {
    const response = await api.get(`/rooms/dms`, {
      params: { offset: offset, limit: limit },
    });
    return response;
  } catch (e: any) {
    // Do nothing
  }
};

export const getDM = async (id: string) => {
  try {
    const response = await api.get(`/rooms/dm/${id}`);
    return response;
  } catch (e: any) {
    // Do nothing
  }
};

export const getRoomMembersCall = async (
  id: string,
  offset: number,
  limit: number,
) => {
  try {
    const response = await api.get(`/rooms/${id}/members`, {
      params: { offset: offset, limit: limit },
    });
    return response;
  } catch (e: any) {
    // Do nothing
  }
};

export const joinRoomCall = async (roomId: string, password?: string) => {
  try {
    const response = await api.post("/rooms/join", {
      roomId: roomId,
      password: password,
    });
    return response;
  } catch (e: any) {
    toast.error(e.response.data.message);
  }
};

export const leaveRoomCall = async (roomId: string) => {
  try {
    const response = await api.post("/rooms/leave", {
      roomId: roomId,
    });
    return response;
  } catch (e: any) {
    toast.error(e.response.data.message);
  }
};

export const takeActionCall = async (
  roomId: string,
  memberId: string,
  action: string,
) => {
  try {
    const response = await api.post(`/rooms/${action}`, {
      roomId: roomId,
      memberId: memberId,
    });
    return response;
  } catch (e: any) {
    toast.error(e.response.data.message);
  }
};

export const DeleteRoomCall = async (roomId: string) => {
  try {
    const response = await api.post("/rooms/delete", {
      roomId: roomId,
    });
    return response;
  } catch (e: any) {
    toast.error(e.response.data.message);
  }
};

export const getFriendsCall = async (offset: number, limit: number) => {
  try {
    const response = await api.get(`/friends/list`, {
      params: { offset: offset, limit: limit },
    });
    return response;
  } catch (e: any) {
    // Do nothing
  }
};
