
import api from "../../../Api/base";




export const getRoomMessagesCall = async (
    id: string,
    offset: number,
    limit: number,
) => {
    try {
        const response = await api.get(`/messages/room/${id}/`,
            { params: { offset: offset, limit: limit } });
        console.log("room messages :");
        console.log(response.status);
        console.log(response.data);
        return response;
    } catch (e: any) {
        console.log(e.response.data.message);
    }

}



export const sendMessageCall = async (
    id: string,
    content: string
) => {
    try {
        const response = await api.post(`messages/room/${id}`,
            { content: content }, { params: { id: id } }
        );
        console.log("send messages :");
        console.log(response.status);
        console.log(response.data);
        return response;
    } catch (e: any) {

        console.log(e.response.data.message);
    }

}