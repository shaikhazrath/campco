"use client";
import Link from "next/link";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { CiSquarePlus } from "react-icons/ci";
import { usePathname } from "next/navigation";
import { FaHeart } from "react-icons/fa";

const NavBar = () => {
  const pathname = usePathname();
  const isChat = pathname === "/Chat";
  const isHome = pathname === "/";
  const isProfile = pathname === "/Profile";
  return (
    <nav>
      <div className="h-16 w-full bg-foreground gap-5 text-white font-bold text-2xl flex items-center uppercase h-ful px-10 justify-between">
        <h1>From Loop</h1>
        <div className="flex gap-4">

        {isHome && (
          <>
          <Link
            href="/Posts/UploadPost"
            className="hover:bg-gradient-to-r from-cyan-500 to-blue-500  rounded-md h-8 flex items-center w-8 justify-center "
          >
            <CiSquarePlus size={35} />
          </Link>
          <Link
            href="/Notifications"
            className=" "
          >
            <FaHeart size={30}  className=" hover:text-red-500 rounded-md  items-center justify-center"/>
          </Link>
          </>
        )}
        </div>

      </div>
    </nav>
  );
};

export default NavBar;
