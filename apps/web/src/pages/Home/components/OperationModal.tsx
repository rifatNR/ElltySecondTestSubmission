import { selectedNodeAtom } from "@/atoms/baseAtom";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import useAuth from "@/utils/hooks/useAuth";
import { trpc, trpcErrorHandler } from "@/utils/trpc";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const OperationModal = () => {
    const utils = trpc.useUtils();
    const { logout } = useAuth();
    const [selectedNode] = useAtom(selectedNodeAtom);

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<{
        operation: "+" | "-" | "*" | "/";
        right_value: number;
    }>({
        operation: "+",
        right_value: 0,
    });

    const { mutate: operateNode, isLoading } =
        trpc.nodes.operateNode.useMutation();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isNaN(Number(formData.right_value))) {
            toast({
                variant: "destructive",
                title: "Please enter a valid number",
                duration: 3000,
            });
            return;
        }

        if (!selectedNode) {
            toast({
                variant: "destructive",
                title: "Please select a node to operate on",
                duration: 3000,
            });
            return;
        }

        operateNode(
            {
                operation: formData.operation,
                right_value: Number(formData.right_value),
                parent_id: selectedNode,
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    setFormData({ operation: "+", right_value: 0 });
                    utils.nodes.list.invalidate();
                },
                onError: (error) => {
                    const errorMessage = trpcErrorHandler(error, logout);
                    toast({
                        variant: "destructive",
                        title: errorMessage,
                        duration: 3000,
                    });
                },
            }
        );
    };

    useEffect(() => {
        if (selectedNode) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [selectedNode]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Operation</DialogTitle>
                        <DialogDescription>
                            Select operation and enter a number.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Label>Operation</Label>
                            <div className="flex gap-2">
                                {(["+", "-", "*", "/"] as const).map((op) => (
                                    <Button
                                        key={op}
                                        type="button"
                                        variant={
                                            formData.operation === op
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                operation: op,
                                            }))
                                        }
                                        className="w-12 text-xl"
                                    >
                                        {op}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Right Value</Label>
                            <Input
                                type="number"
                                value={formData.right_value}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        right_value: Number(e.target.value),
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Processing..." : "Submit"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default OperationModal;
