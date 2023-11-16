import { Link } from "react-router-dom";

import { LeaderBoard } from "./LeaderBoard";

import herosvg from "./assets/Hero.png";

export const Home = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center h-full w-full bg-accent container-lg mx-auto px-4 sm:px-8">
      <div className="flex justify-center relative items-start w-full h-auto max-h-48 sm:max-h-96 mt-8">
        <img
          className="w-full h-full min-h-[150px] object-cover object-center rounded-3xl"
          alt="leaderboard hero"
          src={herosvg}
        />

        <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-around">
          <div className="xl:text-4xl md:text-3xl sm:text-2xl text-xs flex text-neutral font-lexend font-extrabold">
            READY TO PLAY A GAME?
          </div>

          <Link
            to={"/Play"}
            className="transition-all duration-500 hover:scale-110 ease-in-out flex justify-center items-center px-4 sm:px-8 py-2 sm:py-4 rounded-lg bg-gradient-to-t from-violet-800 to-violet-500"
          >
            <span className="text-white font-montserrat text-xs xl:text-[0.99vw]">
              PLAY NOW
            </span>
          </Link>
        </div>
      </div>

      <div className="flex justify-center relative items-start w-full h-auto">
        <LeaderBoard />
      </div>
    </div>
  );
};
