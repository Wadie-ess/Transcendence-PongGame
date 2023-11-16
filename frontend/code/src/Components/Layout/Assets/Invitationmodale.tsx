import { forwardRef, RefObject, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../../Api/base";
import { useSocketStore } from "../../Chat/Services/SocketsServices";
import { useUserStore } from "../../../Stores/stores";

export const InvitationGame = forwardRef<HTMLDialogElement, any>((_, ref) => {
  const [inviter, setInviter] = useState<any>();
  const socketStore = useSocketStore();
  const userStore = useUserStore((state) => ({
    gameId: state.gameInvitation.gameId,
    inviterId: state.gameInvitation.inviterId,
    updateGameInvitationId: state.updateGameInvitationId,
    setGameInvitation: state.setGameInvitation,
  }));
  useEffect(() => {
    if (!userStore.inviterId) return;
    api
      .get(`/profile/${userStore.inviterId}`)
      .then((res) => {
        setInviter(res.data);
      })
      .catch((_err) => {});
  }, [userStore.inviterId]);

  useEffect(() => {
    if (!userStore.inviterId)
      return () => {
        socketStore.socket?.off("game.declined");
      };

    socketStore.socket?.on("game.declined", () => {
      toast.error("Game declined");
      userStore.updateGameInvitationId("");
      (ref as RefObject<HTMLDialogElement>).current?.close();
    });
    return () => {
      socketStore.socket?.off("game.declined");
    };
    //eslint-disable-next-line
  }, [userStore.inviterId, socketStore, ref]);

  return (
    <dialog ref={ref} id="invitaion_game_modal" className="modal ">
      {inviter ? (
        <div className="modal-box">
          <div className="modal-action flex flex-col gap-8">
            <div className="flex flex-col items-center gap-2">
              <img
                src={`${inviter?.picture?.large}`}
                alt="avatar"
                className="h-20 w-20 rounded-full"
              />
              <span className="text-xs text-gray-500 font-light">
                @{inviter?.username}
              </span>
            </div>
            <div className="flex flex-col items-cnter">
              <span className="text-sm text-center text-white font-light">
                {`${inviter?.name?.first} ${inviter?.name?.last} invited you to play a game`}
              </span>
            </div>
            <form method="dialog" className="items-cnter">
              <div className="flex flex-row gap-2 justify-end">
                <button
                  className="btn btn-neutral"
                  onClick={() => {
                    socketStore?.socket?.emit("declineGame", {
                      inviterId: userStore.inviterId,
                      gameId: userStore.gameId,
                    });
                    useUserStore.getState().updateGameInvitationId("");
                  }}
                >
                  Decline
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    socketStore?.socket?.emit("acceptGame", {
                      inviterId: userStore.inviterId,
                      gameId: userStore.gameId,
                    });
                    useUserStore.getState().updateGameInvitationId("");
                  }}
                >
                  Accept
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="modal-box flex flex-row items-cnter justify-center gap-2">
          <span>loading</span>
          <span className="loading loading-dots loading-md">loading</span>
        </div>
      )}
    </dialog>
  );
});
