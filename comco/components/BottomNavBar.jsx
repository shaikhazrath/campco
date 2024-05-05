'use client';
import React, {  useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BiMessageSquare } from "react-icons/bi";
import { LiaImagesSolid } from "react-icons/lia";

const BottomNavBar = () => {
  const pathname = usePathname();
  const isChat = pathname === '/';
  const isPost = pathname === '/Posts';
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 flex justify-around items-center bg-foreground py-2 px-4 shadow-md`}       

    >
      <Link className=" rounded-full p-2 cursor-pointer hover:scale-105 transition-transform" href='/'>
        <BiMessageSquare size={24} color={isChat ? '#0077ff' : '#888888'} />
      </Link>
      <Link className=" rounded-full p-2 cursor-pointer hover:scale-105 transition-transform" href='/Posts'>
        <LiaImagesSolid size={24} color={isPost ? '#0077ff' : '#888888'} />
      </Link>
    </div>
  );
};

export default BottomNavBar;