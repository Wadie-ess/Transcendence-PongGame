import { forwardRef } from "react";
import { useSocketStore } from "../../Chat/Services/SocketsServices";

export const QueueWaitModal = forwardRef<HTMLDialogElement, any>(
  (props, ref) => {
    const socketStore = useSocketStore();
    return (
      <dialog ref={ref} id="queue_modal" className="modal backdrop:bg-black/70">
        <div className="modal-box">
          <div className="modal-action flex flex-col gap-8">
            <div className="flex flex-row justify-center gap-4">
              <span>We are looking for a player for you</span>
              <span className="loading loading-dots loading-md">loading</span>
            </div>
            <form method="dialog">
              <div className="flex flex-row gap-2 justify-end">
                <button
                  className="btn"
                  onClick={() => {
                    socketStore.socket?.emit("quitQueue", {
                      gameMode: props.gameMode,
                    });
                    props.setGameMode("");
                  }}
                >
                  Quit
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    );
  },
);
