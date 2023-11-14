import React, { forwardRef, RefObject, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useUserStore } from "../../../Stores/stores";
import { useSocketStore } from "../../Chat/Services/SocketsServices";

export const InvitationWaiting = forwardRef<HTMLDialogElement, any>(
  (props, ref) => {
    const socketStore = useSocketStore();
    const userStore = useUserStore((state) => ({
      gameId: state.gameWaiting.gameId,
      setGameWaitingId: state.setGameWaitingId,
    }));
    useEffect(() => {
      if (!userStore.gameId)
        return () => {
          socketStore.socket.off("game.declined");
          socketStore.socket.off("game.accepted");
        };

      socketStore.socket.on("game.declined", () => {
        toast.error("Game declined");
        userStore.setGameWaitingId("");
        (ref as RefObject<HTMLDialogElement>).current?.close();
      });
      socketStore.socket.on("game.accepted", () => {
        toast.success("Game accepted");
        userStore.setGameWaitingId("");
        (ref as RefObject<HTMLDialogElement>).current?.close();
      });
      return () => {
        socketStore.socket.off("game.declined");
        socketStore.socket.off("game.accepted");
      };
    }, [userStore.gameId, socketStore.socket, ref]);

    return (
      <dialog
        ref={ref}
        id="invitaion_waiting_modal"
        className="modal backdrop:bg-black/70"
      >
        <div className="modal-box">
          <div className="modal-action flex flex-col gap-8">
            <div className="flex flex-col items-center">
              <img
                src={`${props?.oppenent?.picture?.large}`}
                alt="avatar"
                className="h-20 w-20 rounded-full mb-4"
              />
              <span className="text-sm text-center text-white font-light mb-2">
                {`${props?.oppenent?.name?.first} ${props?.user?.name?.last}`}
              </span>
              <span className="text-xs text-gray-500 font-light">
                @{props?.oppenent?.username}
              </span>
            </div>
            <div className="flex flex-row justify-center gap-4">
              <span>Waiting for the other player to accept</span>
              <span className="loading loading-dots loading-md">loading</span>
            </div>
            <form method="dialog" className="items-cnter">
              <div className="flex flex-row gap-2 justify-end">
                <button
                  className="btn btn-neutral"
                  onClick={() => {
                    socketStore?.socket?.emit("declineGame", {
                      gameId: userStore.gameId,
                    });
                    // set gameId to ""
                    userStore.setGameWaitingId("");
                  }}
                >
                  Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    );
  },
);
