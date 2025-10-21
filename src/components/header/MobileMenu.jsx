"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import LoginSignUpBtn from "./LoginSignUpBtn";
import Image from "next/image";
import FreeResourcesModalBtn from "./FreeResourcesModalBtn";

export default function MobileMenu({
  navLinks,
  isFreeResourcesDrawerOpen,
  toggleFreeResourcesDrawer,
  onLogout,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldOpenLogin, setShouldOpenLogin] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Listen for login modal trigger from HomePageHero
  useEffect(() => {
    const handleOpenLoginPopup = (event) => {
      console.log("MobileMenu received openLoginPopup event:", event.detail);
      // Open the mobile menu first, then trigger login
      setIsOpen(true);
      setShouldOpenLogin(true);
    };

    // Add window function for direct access
    window.triggerMobileLoginModal = () => {
      console.log("triggerMobileLoginModal called");
      setIsOpen(true);
      setShouldOpenLogin(true);
    };

    console.log("MobileMenu adding event listener for openLoginPopup");
    window.addEventListener("openLoginPopup", handleOpenLoginPopup);

    return () => {
      console.log("MobileMenu removing event listener for openLoginPopup");
      window.removeEventListener("openLoginPopup", handleOpenLoginPopup);
      delete window.triggerMobileLoginModal;
    };
  }, []);

  return (
    <div className="md:hidden ">
      <button className="p-2" onClick={() => setIsOpen(true)}>
        <Menu className="w-8 h-8" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer - Now opens from right */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center  h-20  border-gray3 py-2 z-10 [background-image:linear-gradient(to_right,#FFB8004D_0%,#ffffff_40%),linear-gradient(#f2f2f2,#f2f2f2)] bg-no-repeat [background-size:100%_100%] px-4 md:px-0">
          <div className="flex items-center space-x-2 cursor-pointer">
            <Link href="/">
              <Image
                src="/assets/icons/DJA logo Transperant-01 2.png"
                alt="De Jure Academy Logo"
                width={89}
                height={56}
                className="h-[56px] w-[89px] object-contain cursor-pointer"
              />
            </Link>
          </div>

          <button onClick={() => setIsOpen(false)} className="p-1">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-4 space-y-4 relative [background-image:linear-gradient(90deg,rgba(255,184,0,0)_-5.25%,rgba(255,184,0,0.1)_41.47%)] ">
          {navLinks.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="block text-gray-700 hover:text-gray-900 text-[18px] py-2  border-b"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Free Resources Button for Mobile */}
          <div className="py-2 border-b">
            <FreeResourcesModalBtn
              isOpen={isFreeResourcesDrawerOpen}
              toggleDrawer={() => {
                setIsOpen(false); // Close mobile menu first
                toggleFreeResourcesDrawer(); // Then toggle free resources drawer
              }}
            />
          </div>

          <div className="pt-2  w-full flex items-center justify-center">
            <LoginSignUpBtn
              shouldOpenLogin={shouldOpenLogin}
              onLoginOpened={() => setShouldOpenLogin(false)}
              onLogout={onLogout}
            />
          </div>

          {/* Uncomment if you want language switch in mobile menu */}
          {/* <div className="pt-2">
            <LangSwitch />
          </div> */}
        </div>
      </div>
    </div>
  );
}
