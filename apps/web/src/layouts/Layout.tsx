import Navbar from "@/layouts/Navbar";
import useAuth from "@/utils/hooks/useAuth";
import React, { ReactNode } from "react";
import { Redirect } from "wouter";

type Props = {
    children: ReactNode;
};

const Layout = ({ children }: Props) => {
    const { authUser } = useAuth();

    if (process.env.NODE_ENV === "production") {
        const methods: (keyof Console)[] = [
            "log",
            "warn",
            "error",
            "info",
            "debug",
        ];
        methods.forEach((method) => {
            // @ts-expect-error: We're intentionally overriding console methods in production
            console[method] = () => {};
        });
    }

    return (
        <>
            <Navbar />
            <main className="max-w-3xl mx-auto px-5 min-h-[calc(100vh-5rem)] flex flex-col pt-20">
                {children}
                {/* {authUser ? children : <Redirect to="/auth/login" />} */}
            </main>
        </>
    );
};

export default Layout;
