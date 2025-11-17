import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import useAuth from "@/utils/hooks/useAuth";
import { trpc, trpcErrorHandler } from "@/utils/trpc";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

const MainPostForm: React.FC = () => {
    const utils = trpc.useUtils();
    const { authUser, logout } = useAuth();

    const [numberValue, setNumberValue] = useState<number | "">("");
    const [error, setError] = useState<string | null>(null);

    const { mutate: createNode, isLoading } =
        trpc.nodes.createNode.useMutation();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (numberValue === "" || isNaN(Number(numberValue))) {
            setError("Please enter a valid number");
            return;
        }

        setError("");
        createNode(
            {
                right_value: numberValue,
            },
            {
                onSuccess: (data) => {
                    setNumberValue("");
                    utils.nodes.list.invalidate();
                },
                onError: (error) => {
                    const errorMessage = trpcErrorHandler(error, () => {
                        logout();
                    });
                    toast({
                        variant: "destructive",
                        title: errorMessage,
                        duration: 3000,
                        description: "",
                    });
                },
            }
        );
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setError("");
        }, 3000);

        return () => clearTimeout(delayDebounceFn);
    }, [error]);

    return authUser ? (
        <div className="mb-10">
            <h1 className="text-2xl font-medium mb-4">
                Start the chain of calculation.
            </h1>
            {}

            <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between space-x-5">
                    <Input
                        type="number"
                        id="number"
                        placeholder="Enter a number..."
                        value={numberValue}
                        onChange={(e) =>
                            setNumberValue(
                                e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                            )
                        }
                        className={`flex-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            error ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    <Button
                        type="submit"
                        className="bg-rose-500 text-white rounded hover:bg-rose-600"
                    >
                        {isLoading ? (
                            <Loader className="animate-spin" />
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </div>
                {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
            </form>
        </div>
    ) : (
        <></>
    );
};

export default MainPostForm;
