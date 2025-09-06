"use client";

import React from "react";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import {
  FiMenu,
  FiSettings,
  FiDatabase,
  FiPlayCircle,
  FiLogOut,
  FiHome,
  FiCode,
} from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/config/Subpabase.Client";
import { redirect } from "next/navigation";

const Header = () => {
  const user = useUser();

  async function handleLogout() {
    await supabase.auth.signOut();
    redirect("/signin");
  }

  return (
    <header className="bg-black text-white flex justify-between items-center px-8 py-4 border-b border-gray-800">
      {/* Website Name */}
      <div className="text-2xl font-bold text-gray-100">MyAnalytics</div>

      {/* Profile & Dropdown */}
      <div className="flex items-center gap-4">
        {user && user.user_metadata ? (
          <Link href="/profile" className="flex items-center gap-2">
            <img
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata.full_name}
              className="w-8 h-8 rounded-full border border-gray-600"
            />
            <span className="text-sm font-medium text-gray-200">
              {user.user_metadata.full_name}
            </span>
          </Link>
        ) : (
          <Link href="/profile" className="text-sm font-medium text-gray-300">
            Guest
          </Link>
        )}

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <FiMenu
              size={26}
              className="text-gray-300 hover:text-white cursor-pointer transition-colors"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black text-gray-200 border border-gray-700 rounded-md shadow-lg w-52">
            {/* Dashboard */}
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard"
                prefetch={false}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-800 transition-colors"
              >
                <FiHome /> Dashboard
              </Link>
            </DropdownMenuItem>

            {/* Snippet */}
            <DropdownMenuItem asChild>
              <Link
                href="/snippet"
                prefetch={false}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-800 transition-colors"
              >
                <FiCode /> Snippet
              </Link>
            </DropdownMenuItem>

            {/* Settings */}
            <DropdownMenuItem asChild>
              <Link
                href="/settings"
                prefetch={false}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-800 transition-colors"
              >
                <FiSettings /> Settings
              </Link>
            </DropdownMenuItem>

            {/* API */}
            <DropdownMenuItem asChild>
              <Link
                href="/api"
                prefetch={false}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-800 transition-colors"
              >
                <FiDatabase /> API
              </Link>
            </DropdownMenuItem>

            {/* Guide */}
            <DropdownMenuItem asChild>
              <Link
                href="/guide"
                prefetch={false}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-800 transition-colors"
              >
                <FiPlayCircle /> Guide
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-700" />

            {/* Logout */}
            <DropdownMenuItem asChild>
              <p
                onClick={handleLogout}
                className="flex items-center gap-2 px-2 py-1.5 rounded text-red-400 hover:bg-red-500 hover:text-white transition-colors"
              >
                <FiLogOut /> Logout
              </p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
