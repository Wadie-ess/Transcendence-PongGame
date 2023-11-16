import api from "../../../Api/base";

export const getBlockedCall = async (offset: number, limit: number) => {
  try {
    const response = await api.get(`/friends/blocklist`, {
      params: { offset: offset, limit: limit },
    });
    return response;
  } catch (e: any) {
    // Do nothing
  }
};

export const unblockCall = async (friendId: string) => {
  try {
    const response = await api.post("/friends/unblock", {
      friendId: friendId,
    });
    return response;
  } catch (e: any) {
    // Do nothing
  }
};

export const blockUserCall = async (friendId: string) => {
  try {
    const response = await api.post("/friends/block", {
      friendId: friendId,
    });
    return response;
  } catch (e: any) {
    // Do nothing
  }
};
