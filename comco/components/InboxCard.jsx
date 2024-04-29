import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
const InboxCard = ({ user }) => {
  return (
    <Link
      href={`chat/${user._id}`}
      className="flex  items-center gap-5 m-5 bg-slate-100 h-28 p-5 rounded-lg md:w-[40rem] w-[32rem]"
    >
      <Avatar className=" h-16 w-16">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      </Avatar>
      <div>
        <h1 className=" text-xl font-bold ">{user.name}</h1>
        <div className="flex gap-5  justify-between  text-sm font-normal ">
          <h1>new message</h1>
          <h1>time</h1>
        </div>
      </div>
    </Link>
  );
};

export default InboxCard;
