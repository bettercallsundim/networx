"use client";
import { useEffect, useRef, useState } from "react";
import Login from "./components/Login";

export default function page() {
  const divRef = useRef(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    const positionFromTop = divRef?.current?.offsetTop;
    setTop(positionFromTop);
  }, []);

  return (
    <div
      ref={divRef}
      style={{
        height: `calc(100vh - ${top}px)`,
      }}
      className=" min-w-full container mx-auto bg-bng text-text flex flex-col md:flex-row items-center px-2 md:px-8  justify-center md:justify-around overflow-y-hidden"
    >
      <div className="">
        <p className="md:text-[50px] text-[30px]  text-primary leading-[3rem] md:leading-[5rem]">
          <span className="bg-primary text-text px-2 border-t-4 border-text">
            Next Gen. <br className="md:hidden" />
          </span>{" "}
          Social network
          <br />{" "}
          <div>
            <p className=" text-gray-500 text-[25px] md:text-[30px] px-2 border-text">
              Share your thoughts, across the generation
            </p>
          </div>
          {/* <img
            className="w-[150px] mx-auto mt-12 md:mt-0  rounded md:float-end"
            src="https://media1.tenor.com/m/TzaUHHp9un4AAAAd/huh-cat-roblox-huh.gif"
            alt=""
          /> */}
        </p>
        <p className="text-center"></p>
      </div>
      <div className=" relative  flex flex-col items-center justify-center md:w-[300px] h-[100px] lg:h-[400px]  overflow-hidden">
        <div className="hidden lg:block rounded-lg">
          <img className="rounded-lg" src="globe.gif" alt="" />
        </div>
        {/* <div className="hidden lg:block w-[100px] h-full bg-primary  absolute left-0"></div> */}
        {/* <div className="hidden lg:block w-[100px] h-full bg-secondary  absolute right-0"></div> */}
        {/* <div className="hidden lg:block w-[100px] h-full bg-accent   absolute right-[120px]"></div> */}
        {/* <div className="hidden md:block w-[700px] h-full bg-sky-300  absolute"></div>
        <div className="hidden md:block w-[700px] h-full bg-sky-400   absolute top-[50%]"></div> */}

        <Login />
      </div>
    </div>
  );
}
