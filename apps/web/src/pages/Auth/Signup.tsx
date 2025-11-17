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
import { ChevronRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { trpc, trpcErrorHandler } from "@/utils/trpc";
import AuthPageLayout from "@/layouts/AuthPageLayout";
import useAuth from "@/utils/hooks/useAuth";

import { useToast } from "@/hooks/use-toast";
import { navigate } from "wouter/use-browser-location";

const formSchema = z
    .object({
        username: z
            .string()
            .min(1, { message: "Name is required." })
            .max(100, { message: "Name cannot exceed 100 characters." }),
        password: z.string().min(1, {
            message: "Password is required.",
        }),
        confirm_password: z.string().min(1, {
            message: "Confirm password is required.",
        }),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match.",
        path: ["confirm_password"],
    });

export default function Signup() {
    const { toast } = useToast();
    const { authSuccess } = useAuth();

    const [isView, setIsView] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            confirm_password: "",
        },
    });

    const { mutate: signup, isLoading } = trpc.users.signup.useMutation();

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        signup(
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

                    toast({
                        variant: "default",
                        title: "Account created successfully. plese wait for approval.",
                        duration: 5000,
                    });
                    navigate("/auth/login");
                },
                onError: (error) => {
                    console.log("Error: ", error);

                    toast({
                        variant: "destructive",
                        title: trpcErrorHandler(error),
                        duration: 3000,
                        description: "Something went wrong.",
                    });
                },
            }
        );
    }

    return (
        <AuthPageLayout>
            <div className="min-h-screen min-w-screen flex items-center justify-center md:py-10">
                <div className="max-w-xl w-full p-5 md:border md:shadow md:rounded-lg">
                    <h1 className="text-3xl font-medium">Sign Up</h1>
                    <h1 className="font-medium mt-1">
                        Join <strong>"ellty"</strong>
                    </h1>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-3 mt-5"
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
                                                    placeholder="Enter Password..."
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
                            <FormField
                                control={form.control}
                                name="confirm_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Confirm Password..."
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
                                Already have an account?{" "}
                                <Link
                                    href="/auth/login"
                                    className="hover:underline font-medium text-indigo-600"
                                >
                                    Sign In
                                </Link>
                            </div>
                            <Button
                                className="!mt-7 h-12 px-5 w-full md:w-auto"
                                type="submit"
                            >
                                Sign Up
                                {isLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <ChevronRight />
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </AuthPageLayout>
    );
}
