"use client";
import { removeDataFromLocal } from "@/utils/localStorage";
import { googleLogout } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import * as React from "react";
import toast from "react-hot-toast";
import { BiMessageDetail } from "react-icons/bi";
import { CiMenuFries } from "react-icons/ci";
import { IoMdClose, IoMdLogOut } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { SiGravatar } from "react-icons/si";
import { SlFeed } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";

import { HomeIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { FaPeopleRoof } from "react-icons/fa6";
import { logOut } from "../redux/globalSlice";
import SearchUsers from "./SearchUsers";

function Nav() {
  const user = useSelector((state) => state.globalSlice.user);

  const mblLinks = [
    {
      name: "Home",
      link: "/",
      icon: <HomeIcon />,
      description: "",
    },
    {
      name: "Feed",
      link: "/feed",
      icon: <SlFeed />,
      description: "",
    },
    {
      name: "My Profile",
      link: "/profile/" + user?._id,
      icon: <SiGravatar />,
      description: "",
    },
    {
      name: "Global Feed",
      link: "/global_feed",
      icon: <FaPeopleRoof />,
      description: "",
    },
    {
      name: "Conversations",
      link: "/conversations",
      icon: <BiMessageDetail />,
      description: "",
    },
  ];
  const router = useRouter();
  const [showMenu, setShowMenu] = React.useState(false);
  const handleLogout = () => {
    googleLogout();
    const notify = () => toast.success("Logged out successfully");
    notify();
    dispatch(logOut());
    removeDataFromLocal("token");
    removeDataFromLocal("user");
    window.location.href = process.env.NEXT_PUBLIC_FRONTEND;
  };

  const dispatch = useDispatch();
  const [theme, setTheme] = React.useState("");
  function toggleTheme() {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }
  React.useEffect(() => {
    if (localStorage.getItem("theme")) {
      setTheme(localStorage.getItem("theme"));
    } else {
      setTheme("light");
      localStorage.setItem("theme", "light");
    }
  }, []);
  React.useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("light");
    if (theme) document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const links = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Feed",
      path: "/feed",
    },
    {
      name: "Global Feed",
      path: "/global_feed",
    },
  ];
  return (
    <nav className="flex flex-col">
      <div className="flex items-center justify-between py-4 md:py-0 px-8 glassmorph text-text">
        <div className="logo font-bold text-2xl">
          <Link href="/">NETWORX</Link>
        </div>
        {user?.email && (
          <div className="w-[30%] hidden md:block">
            <SearchUsers />
          </div>
        )}
        <div className="links hidden md:block">
          <ul className="flex items-center gap-x-6">
            {user?.email &&
              links.map((link, ind) => (
                <Link
                  className="hover:bg-primary hover:text-bng duration-300 py-3 px-4 cursor-pointer"
                  href={link.path}
                  key={ind}
                >
                  {link.name}
                </Link>
              ))}
            {user?.email && (
              <button
                className="hover:bg-primary hover:text-bng duration-300 py-3 px-4  cursor-pointer"
                onClick={handleLogout}
              >
                Log Out
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="hover:bg-primary hover:text-bng duration-300 py-2 px-4 cursor-pointer"
            >
              {theme === "light" ? (
                <MdDarkMode className="text-3xl " />
              ) : (
                <MdLightMode className="text-3xl " />
              )}
            </button>
          </ul>
        </div>
        <div className="menuButton md:hidden">
          <button
            className="md:hidden"
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          >
            {showMenu ? (
              <IoMdClose className="text-3xl" />
            ) : (
              <CiMenuFries className="text-3xl" />
            )}
          </button>
        </div>
      </div>
      {showMenu && (
        <div className="bg-bng h-full shadow-lg  md:hidden py-4 px-4">
          <SearchUsers setShowMenu={setShowMenu} />
          {mblLinks.map((link) => (
            <p onClick={() => setShowMenu(false)}>
              <Link
                prefetch={false}
                href={link.link}
                className="flex items-center gap-x-4 py-4 hover:bg-secondary rounded-l-lg rounded-r-lg"
              >
                <span className="text-primary">{link.icon}</span>
                <h1 className="text-text">{link.name}</h1>
              </Link>
            </p>
          ))}
          {user?.email && (
            <li
              className="flex items-center gap-x-4 py-4 hover:bg-secondary rounded-l-lg rounded-r-lg"
              onClick={() => {
                handleLogout();
                setShowMenu(false);
              }}
            >
              <button className="flex items-center gap-x-4">
                {" "}
                <span>
                  <IoMdLogOut className=" my-auto text-primary" />
                </span>{" "}
                <span className="text-text">Log Out</span>
              </button>
            </li>
          )}
          <li
            className="flex items-center gap-x-4 py-4 hover:bg-secondary rounded-l-lg rounded-r-lg"
            onClick={() => {
              toggleTheme();
              setShowMenu(false);
            }}
          >
            <button className="flex items-center gap-x-4">
              {theme === "light" ? (
                <MdDarkMode className=" my-auto text-primary" />
              ) : (
                <MdLightMode className=" my-auto text-primary" />
              )}
              <span className="text-text">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </span>
            </button>
          </li>
        </div>
      )}
    </nav>
  );
}

export default Nav;
