"use client";

import { KeyRound, LogOut, User } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";
import useAuth from "@/utils/hooks/useAuth";
import { navigate } from "wouter/use-browser-location";

type PropType = {
    children: ReactNode;
};
const ProfileDropdown = ({ children }: PropType) => {
    const { authUser, logout } = useAuth();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel className="text-xl px-3 mb-2">
                    Hi, {authUser?.username}
                </DropdownMenuLabel>
                {/* <DropdownMenuGroup>
                    <DropdownMenuItem className="text-lg cursor-pointer px-3">
                        <User />
                        <span>Profile</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup> */}
                <DropdownMenuItem
                    onClick={() => navigate("/change-password")}
                    className="text-lg cursor-pointer px-3"
                >
                    <KeyRound />
                    <span>Change Password</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={logout}
                    className="py-2 text-lg cursor-pointer px-3"
                >
                    <LogOut />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileDropdown;
