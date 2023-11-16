import VsBot from "./assets/VsBot.svg";
import vsUser from "./assets/VsUser.svg";
import { useSocketStore } from "../Chat/Services/SocketsServices";
import toast from "react-hot-toast";
import { QueueWaitModal } from "./assets/queuemodal";
import { useRef, useState } from "react";
export const Play = () => {
  const socketStore = useSocketStore();
  const [gameMode, setGameMode] = useState("");
  const queueModalRef = useRef<HTMLDialogElement>(null);
  const subscribeToGame = async () => {
    try {
      socketStore.socket?.emit("startGame", { gameMode: "cassic" });
      setGameMode("cassic");
      queueModalRef.current?.showModal();
      toast.success(
        "Match making in Progress you can move until find opponent",
        {
          duration: 5000,
        },
      );
    } catch (error) {
      toast.error("can not start game");
    }
  };
  const subscribeToGameExtra = async () => {
    try {
      socketStore.socket?.emit("startGame", { gameMode: "extra" });
      setGameMode("extra");
      queueModalRef.current?.showModal();
      toast.success(
        "Match making in Progress you can move until find opponent",
        {
          duration: 5000,
        },
      );
    } catch (error) {
      toast.error("can not start game");
    }
  };
  return (
    <>
      <div className="grid md:grid-cols-2 gap-4 p-10 container-lg mx-auto">
        <img
          src={vsUser}
          alt="Classic Gamemode"
          className="mx-auto"
          onClick={subscribeToGame}
        />
        <img
          src={VsBot}
          alt="Extra Gamemode"
          className="mx-auto"
          onClick={subscribeToGameExtra}
        />
      </div>
      <QueueWaitModal
        gameMode={gameMode}
        setGameMode={setGameMode}
        ref={queueModalRef}
      />
    </>
  );
};
