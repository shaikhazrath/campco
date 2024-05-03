"use client";
import Link from "next/link";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";

const NavBar = ({ url = "/", required = true }) => {
  return (
<nav >
  {
    required ? 
    <Link href={url} className="h-16 w-full bg-foreground gap-5 text-white font-bold text-2xl flex items-center uppercase h-ful px-10">
    <IoIosArrowBack color="white" size={20}/>
    <h1>From Loop</h1>
    </Link>
    :
    <div className="h-16 w-full bg-foreground gap-5 text-white font-bold text-2xl flex items-center uppercase h-ful px-10">
    <h1>From Loop</h1>
    </div>
  }

</nav>
  );
};

export default NavBar;
