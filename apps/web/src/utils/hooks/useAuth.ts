import { AuthType } from "@/utils/types";
import { useCallback, useMemo } from "react";
import { useCookies } from "react-cookie";

const COOKIE_OPTIONS = {
    path: "/",
    maxAge: 3600, // 1 hour in seconds (more reliable than expires)
} as const;

const useAuth = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);

    const authUser = useMemo<AuthType | undefined>(
        () => cookies.user,
        [cookies.user]
    );

    const authSuccess = useCallback(
        (token: string, user: AuthType) => {
            console.log("🔴🔴🔴 SETTING COOKIE 🔴🔴🔴");

            setCookie("token", token, COOKIE_OPTIONS);
            setCookie("user", user, COOKIE_OPTIONS);
        },
        [setCookie] // setCookie is stable from react-cookie
    );

    const logout = useCallback(() => {
        removeCookie("token", { path: "/" });
        removeCookie("user", { path: "/" });
    }, [removeCookie]); // removeCookie is stable from react-cookie

    const isAuthenticated = useMemo(
        () => Boolean(cookies.token && cookies.user),
        [cookies.token, cookies.user]
    );

    return useMemo(
        () => ({
            authUser,
            authSuccess,
            logout,
            isAuthenticated,
        }),
        [authUser, authSuccess, logout, isAuthenticated]
    );
};

export default useAuth;
