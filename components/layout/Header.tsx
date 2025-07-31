"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Image as ImageIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";

export const Header: React.FC = () => {
  const { user, logout: authLogout } = useAuth();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("access_token");

    authLogout();

    router.push("/");
  };

  return (
    <header className="border-b border-border/20 bg-gray-100 dark:bg-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ImageIcon className="h-8 w-8 text-primary" />
          <a href="" className="text-2xl font-bold gradient-text cursor-pointer">ImageFlow</a>
        
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="glass">
              <User className="mr-2 h-4 w-4" />
              {user?.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="glass bg-white text-black"
          >
            <DropdownMenuItem className="font-medium">
              {user?.email}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive ">
              <LogOut className="mr-2 h-4 w-4 text-black" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
