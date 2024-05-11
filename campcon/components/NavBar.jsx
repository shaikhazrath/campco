"use client";
import Link from "next/link";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { CiSquarePlus } from "react-icons/ci";
import { usePathname, useRouter} from "next/navigation";
import { FaUserPlus } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handelogOut = ()=>{
    try {
      localStorage.removeItem('token')
      router.push('/auth')
    } catch (error) {
      console.log(error)
    }
  }
  
  const isChat = pathname === "/Chat";
  const isHome = pathname === "/";
  const isProfile = pathname === "/Profile";
  return (
    <nav>
      <div className="h-16 w-full bg-foreground gap-5 text-white font-bold text-2xl flex items-center uppercase h-ful px-10 justify-between">
      {!isHome && !isChat && !isProfile  && (
            <button
              onClick={() => router.back()}
              className="hover:bg-gradient-to-r from-cyan-500 to-blue-500  rounded-md h-8 flex items-center w-8 justify-center "
            >
              <IoIosArrowBack size={25} />
            </button>
          )}
        <h1>CampCon</h1>
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
            href="/AddUsers"
            className=" "
          >
            <FaUserPlus size={30}  className=" hover:text-green-500 rounded-md  items-center justify-center"/>
          </Link>
          </>
        )}

        {
          isChat && (
            <Link
            href="/AddUsers"
            className=" "
          >
            <FaUserPlus size={30}  className=" hover:text-green-500 rounded-md  items-center justify-center"/>
          </Link>
          )
        }
        {
          isProfile && (
              <AlertDialog>
                      <AlertDialogTrigger asChild className=" bg-foreground">
                        <div>
                          <MdLogout className=" text-red-500" size={20} />
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure? you want to Logout
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handelogOut}
                            className="bg-red-500 text-xl font-bold w-full"
                          >
                            LogOut
                            <MdLogout className=" text-white" size={20} />
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
          )
        }
        </div>

      </div>
    </nav>
  );
};

export default NavBar;
