// components/OffCanvasMenu.tsx
import Link from "next/link";

import React from "react";

const SlidingMenu = () => {
  const toggleButton = () => {
    const cardContainer = document.getElementById("cardContainer");
    if (cardContainer) {
      cardContainer.style.width = cardContainer.style.width === "350px" ? "0" : "350px";
    }
  };

  const closeButton = () => {
    const cardContainer = document.getElementById("cardContainer");
    if (cardContainer) {
      cardContainer.style.width = "0";
    }
  };

  return (
    <div>
      {/* Off-Canvas Toggle Button */}
      <button
        onClick={toggleButton}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-menu"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      {/* Off-Canvas Menu */}
      <div
        id="cardContainer"
        className="fixed top-0 right-0 h-full w-0 overflow-hidden bg-black bg-opacity-30 backdrop-blur-lg shadow-lg transition-all duration-300 z-10"
      >
        <button
          onClick={closeButton}
          className="text-red-500 absolute top-6 right-6 z-30"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        {/* Menu Items */}
        <div className="w-full h-full px-8 py-16 relative">
          <div className="w-full h-auto flex flex-col gap-y-1 mt-6">
            {/* Repeat for each menu item */}
            <div className="w-full h-auto flex items-center gap-x-4 text-gray-200 hover:text-gray-100 hover:bg-blue-500 rounded-md px-4 py-3 ease-out duration-500 cursor-pointer">
            <Link href="/
">
              <h1 className="text-base font-medium">Home
              </h1>
              </Link>

              
            </div>
            
            <div className="w-full h-auto flex items-center gap-x-4 text-gray-200 hover:text-gray-100 hover:bg-blue-500 rounded-md px-4 py-3 ease-out duration-500 cursor-pointer">
            <Link href="/myProjects
">
              <h1 className="text-base font-medium">Projects
              </h1>
              </Link>

              
            </div>
            <div className="w-full h-auto flex items-center gap-x-4 text-gray-200 hover:text-gray-100 hover:bg-blue-500 rounded-md px-4 py-3 ease-out duration-500 cursor-pointer">
            <Link href="/myTeam
">
              <h1 className="text-base font-medium">Team
              </h1>
              </Link>

              
            </div>
            <div className="w-full h-auto flex items-center gap-x-4 text-gray-200 hover:text-gray-100 hover:bg-blue-500 rounded-md px-4 py-3 ease-out duration-500 cursor-pointer">
            <Link href="/completedProject
">
              <h1 className="text-base font-medium">Completed Projects
              </h1>
              </Link>

              
            </div>
            
            
            
          </div>

          {/* Footer */}
          <div className="absolute bottom-6 left-0 px-8 w-full h-auto text-center border-t border-gray-800 pt-6 text-white text-sm font-thin">
            Copyright © 2024. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlidingMenu;
