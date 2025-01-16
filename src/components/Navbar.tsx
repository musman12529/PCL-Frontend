"use client";

import React from "react";
import { useEffect } from "react";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import SlidingMenu from "./SlidingMenu"; // Adjust the import path as needed


const Navbar = (user: any) => {
  const { data: session }: any = useSession();
  
  console.log("email : " + user.email);
  
  
  return (
    
    <div>
      <ul className="flex items-center m-10 w-full">
        {/* Home Button - Positioned at the left corner */}
        <div>
          <Link href="/">
            <li className="hover:bg-blue-500 hover:text-white p-2 rounded">Home</li>
          </Link>
        </div>
        
        {/* Other Menu Items - Positioned on the right */}
        <div className="ml-auto flex gap-10">
          
            
          
          
          {!session ? (
            <>
              <Link href="/login">
                <li className="hover:bg-blue-500 hover:text-white p-2 rounded">Login</li>
              </Link>
              <Link href="/register">
                <li className="hover:bg-blue-500 hover:text-white p-2 rounded">Register</li>
              </Link>
            </>
          ) : (
            <>
            
              {session.user?.email}
              <li className=" p-2 rounded">{localStorage.getItem("email")}</li>
              <li>
                <button
                  onClick={() => {
                    signOut({callbackUrl:`/`});
                  }}
                  className="p-2 px-5 mr-4 hover:bg-blue-500 rounded-full hover:text-white"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </div>

        {/* Conditionally render Sliding Menu - only show when logged in */}
        {session && (
          <div className="flex space-x-4">
            <SlidingMenu />
          </div>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
