import { Toaster } from "@/components/ui/toaster";
import Routes from "@/Routes";
import { trpc } from "@/utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { Provider } from "jotai";
import React, { useMemo, useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";

export default function App() {
    const [queryClient] = useState(() => new QueryClient());
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

    const trpcClient = useMemo(() => {
        return trpc.createClient({
            links: [
                httpBatchLink({
                    url:
                        process.env.NODE_ENV == "development"
                            ? "http://localhost:3333/trpc"
                            : "https://elltysecondtestsubmission-production.up.railway.app/trpc",
                    async headers() {
                        return {
                            authorization: cookies.token
                                ? `Bearer ${cookies.token}`
                                : undefined,
                        };
                    },
                }),
            ],
        });
    }, [cookies.token]);

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <CookiesProvider defaultSetOptions={{ path: "/" }}>
                    <Provider>
                        <Routes />
                        <Toaster />
                    </Provider>
                </CookiesProvider>
            </QueryClientProvider>
        </trpc.Provider>
    );
}
