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
import { useState } from "react";

const OperationModal = () => {
    const utils = trpc.useUtils();
    const { authUser, logout } = useAuth();
    const [selectedNode, setSelectedNode] = useAtom(selectedNodeAtom);

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
                description: "",
            });
            return;
        }

        if (!selectedNode) {
            toast({
                variant: "destructive",
                title: "Please select a node to operate on",
                duration: 3000,
                description: "",
            });
            return;
        }

        operateNode(
            {
                operation: formData.operation,
                right_value: 10,
                parent_id: selectedNode,
            },
            {
                onSuccess: (data) => {
                    setOpen(false);
                    setFormData({
                        operation: "+",
                        right_value: 0,
                    });
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Operation</DialogTitle>
                        <DialogDescription>
                            Select your operation and enter a number.
                        </DialogDescription>
                    </DialogHeader>
                    <div></div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
};

export default OperationModal;
