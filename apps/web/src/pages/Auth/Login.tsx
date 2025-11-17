import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { trpc, trpcErrorHandler } from "@/utils/trpc";
import AuthPageLayout from "@/layouts/AuthPageLayout";
import useAuth from "@/utils/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
});

export default function Login() {
    const { toast } = useToast();
    const { authSuccess } = useAuth();

    const [isView, setIsView] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const { mutate: login, isLoading } = trpc.users.login.useMutation();

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        login(
            {
                username: values.username,
                password: values.password,
            },
            {
                onSuccess: (data) => {
                    console.log("Data: ", data);
                    authSuccess(data.token, {
                        ...data.user,
                    });
                },
                onError: (error) => {
                    console.log("Error: ", error);

                    toast({
                        variant: "destructive",
                        title: trpcErrorHandler(error),
                        duration: 3000,
                        description: "Contact your supervisor for help.",
                    });
                },
            }
        );
    }

    return (
        <AuthPageLayout>
            <div className="min-h-screen min-w-screen flex items-center justify-center">
                <div className="max-w-xl w-full p-5 md:border md:shadow md:rounded-lg">
                    <h1 className="text-3xl font-medium">Login</h1>
                    <h1 className="font-medium mt-1">
                        Login to <strong>"ellty"</strong>
                    </h1>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 mt-5"
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter username..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter password..."
                                                    type={
                                                        isView
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    {...field}
                                                />
                                                {isView ? (
                                                    <Eye
                                                        className="absolute right-2 top-1.5 z-10 w-5 cursor-pointer text-gray-500"
                                                        onClick={() =>
                                                            setIsView(!isView)
                                                        }
                                                    />
                                                ) : (
                                                    <EyeOff
                                                        className="absolute right-2 top-1.5 z-10 w-5 cursor-pointer text-gray-500"
                                                        onClick={() =>
                                                            setIsView(!isView)
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div>
                                Don't have an account?{" "}
                                <Link
                                    href="/auth/signup"
                                    className="hover:underline font-medium text-indigo-600"
                                >
                                    Join Now
                                </Link>
                            </div>
                            <Button
                                className="!mt-7 h-12 px-5 w-full md:w-auto"
                                id="login-btn"
                                type="submit"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <LogIn />
                                )}
                                Login
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </AuthPageLayout>
    );
}
