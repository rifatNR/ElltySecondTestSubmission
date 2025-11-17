import { selectedNodeAtom } from "@/atoms/baseAtom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RouterOutputs } from "@/utils/trpc";
import { useAtom } from "jotai";
import { CirclePlus } from "lucide-react";
import React from "react";

type TreeNode = RouterOutputs["nodes"]["list"]["nodes"][0];
type Node = TreeNode & { children?: TreeNode[] };

const Children = ({ parent, nodes }: { parent: Node; nodes: Node[] }) => {
    const [selectedNode, setSelectedNode] = useAtom(selectedNodeAtom);

    return (
        <>
            {nodes.map((item) => (
                <div>
                    {/* Children acting as parent */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://img.freepik.com/premium-vector/cute-banana-cartoon-vector-icon-illustration-logo-mascot-hand-drawn-concept-trandy-cartoon_519183-187.jpg?w=360" />
                                <AvatarFallback>Mr Banana</AvatarFallback>
                            </Avatar>
                            <div className="">
                                <div className="text-base font-medium">
                                    Mr. Banana:{" "}
                                    <span className="font-normal">
                                        {parent.result_value} {item.operation}{" "}
                                        {item.right_value} ={" "}
                                        <span className="text-red-400">
                                            {item.result_value}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedNode(item.id);
                            }}
                            className="text-gray-500"
                        >
                            <CirclePlus />
                        </button>
                    </div>

                    {/* Children */}
                    {item.children?.length ? (
                        <div className="ml-12 mt-6 space-y-4">
                            <Children parent={item} nodes={item.children} />
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            ))}
        </>
    );
};

export default Children;
