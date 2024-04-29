"use client";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CiBellOn } from "react-icons/ci";
import { Button } from "./ui/button";
import { IoPersonAdd } from "react-icons/io5";

const NavBar = () => {
  return (
    <nav className="flex justify-between gap-10 p-5 bg-slate-100 items-center">
      <Link href="/" className="text-4xl font-mono font-bold">
        camcon
      </Link>
      <div className="flex gap-5 items-center ">
        <Link href="/profile">
          <Avatar className=" h-12 w-12">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          </Avatar>
        </Link>
        <Button className="rounded-full w-10 p-1 h-10">
        <Link href="/search">

          <IoPersonAdd size={20} />
        </Link>

        </Button>
        {/* <Link href="/notifications">
          <CiBellOn size={30} />
        </Link> */}
      </div>
    </nav>
  );
};

export default NavBar;
