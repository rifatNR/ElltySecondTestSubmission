import { Button } from "@/components/ui/button";
import useAuth from "@/utils/hooks/useAuth";
import { Link } from "wouter";

const Navbar = () => {
    const { authUser, logout } = useAuth();

    return (
        <div className="fixed w-full shadow z-navbar bg-white">
            <div className="max-w-3xl mx-auto px-5 flex items-center justify-between">
                <Link href={"/"} className="flex items-center space-x-2 py-2">
                    <img src="/logo.svg" alt="" className="w-7" />
                    <div className="flex items-center space-x-3">
                        <div className="text-lg font-bold">ellty </div>
                    </div>
                </Link>

                <div className="">
                    {authUser ? (
                        <Button onClick={logout}>Logout</Button>
                    ) : (
                        <Link href="/auth/login">
                            <Button>Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
