import Navbar from "@/layouts/Navbar";
import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

const Layout = ({ children }: Props) => {
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
            </main>
        </>
    );
};

export default Layout;
