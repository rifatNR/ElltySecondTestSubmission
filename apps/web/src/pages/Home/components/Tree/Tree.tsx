import { selectedNodeAtom } from "@/atoms/baseAtom";
import { toast } from "@/hooks/use-toast";
import TreeAvatar from "@/pages/Home/components/Tree/TreeAvatar";
import Children from "@/pages/Home/components/Tree/TreeChildren";
import useAuth from "@/utils/hooks/useAuth";
import { RouterOutputs, trpc, trpcErrorHandler } from "@/utils/trpc";
import { useAtom } from "jotai";
import { CirclePlus } from "lucide-react";
import React, { useMemo } from "react";

type TreeNode = RouterOutputs["nodes"]["list"]["nodes"][0];
type Node = TreeNode & { children?: TreeNode[] };

const buildTree = (flat: Node[]): Node[] => {
    const map = new Map<string, Node>();

    flat.forEach((node) => {
        map.set(node.id, { ...node, children: [] });
    });

    const roots: Node[] = [];

    map.forEach((node) => {
        if (node.parent_id) {
            const parent = map.get(node.parent_id);
            if (parent) {
                parent.children!.push(node);
            }
        } else {
            roots.push(node);
        }
    });

    return roots;
};

const Tree = () => {
    const { authUser, logout } = useAuth();
    const [selectedNode, setSelectedNode] = useAtom(selectedNodeAtom);

    const { data: nodesData } = trpc.nodes.list.useQuery(undefined, {
        enabled: !!authUser,
        onSuccess: (data) => {},
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
    });

    const treeData = useMemo(
        () => (nodesData?.nodes ? buildTree(nodesData.nodes) : []),
        [nodesData]
    );

    return (
        <div className="space-y-10">
            {treeData.map((item) => (
                <div key={item.id} className="bg-slate-100 shadow p-5">
                    {/* Parent */}
                    <div className="group flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <TreeAvatar username={item.user_username} />

                            <div className="">
                                <div className="text-xl font-medium">
                                    {item.user_username}:{" "}
                                    <span className="text-red-500">
                                        {item.result_value}
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
                        <div className="ml-16 mt-6 space-y-4">
                            <Children parent={item} nodes={item.children} />
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Tree;
