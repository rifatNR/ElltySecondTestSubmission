import { selectedNodeAtom } from "@/atoms/baseAtom";
import TreeAvatar from "@/pages/Home/components/Tree/TreeAvatar";
import useAuth from "@/utils/hooks/useAuth";
import { RouterOutputs } from "@/utils/trpc";
import { useAtom } from "jotai";
import { CirclePlus } from "lucide-react";
import React from "react";

type TreeNode = RouterOutputs["nodes"]["list"]["nodes"][0];
type Node = TreeNode & { children?: TreeNode[] };

const Children = ({ parent, nodes }: { parent: Node; nodes: Node[] }) => {
    const { authUser } = useAuth();

    const [selectedNode, setSelectedNode] = useAtom(selectedNodeAtom);

    return (
        <>
            {nodes.map((item) => (
                <div>
                    {/* Children acting as parent */}
                    <div className="group flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <TreeAvatar username={item.user_username} />
                            <div className="">
                                <div className="text-base font-medium">
                                    {item.user_username}:{" "}
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
                        {authUser && (
                            <button
                                onClick={() => {
                                    setSelectedNode(item.id);
                                }}
                                className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <CirclePlus />
                            </button>
                        )}
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
