import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileDropdown from "@/layouts/ProfileDropdown";
import useAuth from "@/utils/hooks/useAuth";
import { Link } from "wouter";

const getAvatarFallback = (name: string): string => {
    const words = name.trim().split(/\s+/);
    const initials =
        words.length > 1
            ? `${words[0][0]}${words[words.length - 1][0]}`
            : words[0][0];
    return initials.toUpperCase();
};

const Navbar = () => {
    const { authUser } = useAuth();

    return (
        <div className="fixed w-full shadow z-navbar bg-white">
            <div className="max-w-3xl mx-auto px-5 flex items-center justify-between">
                <Link href={"/"} className="flex items-center space-x-2 py-2">
                    <img src="/logo.svg" alt="" className="w-7" />
                    <div className="flex items-center space-x-3">
                        <div className="text-lg font-bold">ellty </div>
                    </div>
                </Link>

                <div className="py-2">
                    {authUser ? (
                        <ProfileDropdown>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>
                                    {getAvatarFallback(authUser.username)}
                                </AvatarFallback>
                            </Avatar>
                        </ProfileDropdown>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
