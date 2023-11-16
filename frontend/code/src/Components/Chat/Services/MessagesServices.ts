import api from "../../../Api/base";

export const getRoomMessagesCall = async (
  id: string,
  offset: number,
  limit: number,
) => {
  try {
    const response = await api.get(`/messages/room/${id}/`, {
      params: { offset: offset, limit: limit },
    });
    return response;
  } catch (e: any) {
    return e.response;
  }
};

export const sendMessageCall = async (
  id: string,
  content: string,
  clientMessageId?: string,
) => {
  try {
    const response = await api.post(
      `messages/room/${id}`,
      { content, clientMessageId },
      { params: { id: id } },
    );
    return response;
  } catch (e: any) {
    return e.response;
  }
};
