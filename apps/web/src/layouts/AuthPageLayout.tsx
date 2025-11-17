import useAuth from "@/utils/hooks/useAuth";
import React, { ReactNode } from "react";
import { Redirect } from "wouter";

type Props = {
    children: ReactNode;
};

const AuthPageLayout = ({ children }: Props) => {
    const { authUser } = useAuth();

    if (authUser) {
        window.location.href = "/";
        return null;
    }

    // return <>{children}</>;
    return <>{authUser ? <Redirect to="/" replace /> : children}</>;
};

export default AuthPageLayout;
