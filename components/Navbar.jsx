import Image from "next/image";
import cauldron from "../public/cauldron.png";
import Link from "next/link";
import NavbarBtn from "./utility/navbarBtn";
import { useState, useContext, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../lib/firebase";
import { signOut as fSignOut } from "firebase/auth";
import { useRouter } from "next/router";

export default function Navbar({}) {
  const { user, username } = useAuth();
  const router = useRouter();
  return (
    <div className="flex flex-row justify-between md:justify-around  w-full bg-navbar shadow-xl">
      <div className=" flex center items-center justify-center p-4 ">
        <Image
          src={cauldron}
          alt="picture of the logo"
          width={42}
          height={42}
        />
        <h1 className="font-semibold text-xl ml-2 mt-2">Whimsical</h1>
      </div>

      <div>
        {username && (
          <div className="flex flex-row ">
            <div className="hidden md:block md:flex md:justify-around md:items-center md:p-4 ">
              <button
                className="font-semibold p-3 rounded-md mr-8 border-2 border-cyan-500 transition-all hover:translate-y-1 hover:bg-cyan-500"
                onClick={async () => {
                  await fSignOut(auth);
                  router.reload();
                }}
              >
                Sign Out
              </button>
            </div>
            <div className="hidden md:block md:flex md:justify-around md:items-center md:p-4 ">
              <NavbarBtn btnName="Write Posts" btnLink="/admin" />
            </div>
          </div>
        )}

        {!username && (
          <div className="hidden md:block md:flex md:justify-around md:items-center md:p-4 ">
            <NavbarBtn btnName="Login" btnLink="/enter" />
          </div>
        )}
      </div>
    </div>
  );
}
