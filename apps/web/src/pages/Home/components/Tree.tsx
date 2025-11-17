import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Node } from "@/utils/types";
import React, { useMemo } from "react";

const nodes = [
    {
        id: "1",
        parent_id: null,
        user_id: "xxx",
        operation: null,
        right_value: null,
        result_value: 10,
        created_at: "---",
    },
    {
        id: "2",
        parent_id: null,
        user_id: "xxx",
        operation: null,
        right_value: null,
        result_value: 11,
        created_at: "---",
    },
    {
        id: "3",
        parent_id: null,
        user_id: "xxx",
        operation: null,
        right_value: null,
        result_value: 5,
        created_at: "---",
    },
    {
        id: "10",
        parent_id: "1",
        user_id: "xxx",
        operation: "*",
        right_value: 4,
        result_value: 40,
        created_at: "---",
    },
    {
        id: "11",
        parent_id: "1",
        user_id: "xxx",
        operation: "*",
        right_value: 7,
        result_value: 70,
        created_at: "---",
    },
    {
        id: "30",
        parent_id: "3",
        user_id: "xxx",
        operation: "+",
        right_value: 4,
        result_value: 9,
        created_at: "---",
    },
    {
        id: "100",
        parent_id: "10",
        user_id: "xxx",
        operation: "/",
        right_value: 8,
        result_value: 5,
        created_at: "---",
    },
];

const buildTree = (flat: Node[]): Node[] => {
    const map = new Map<string, Node>();

    flat.forEach((node) => {
        map.set(node.id, { ...node, children: [] });
    });

    const roots: Node[] = [];

    // Step 2: Link children to parents
    map.forEach((node) => {
        if (node.parent_id) {
            const parent = map.get(node.parent_id);
            if (parent) {
                parent.children!.push(node);
            }
        } else {
            roots.push(node); // parent_id === null → root node
        }
    });

    return roots;
};

const Children = ({ parent, nodes }: { parent: Node; nodes: Node[] }) => {
    return (
        <>
            {nodes.map((item) => (
                <div>
                    {/* Children acting as parent */}
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
        </>
    );
};

const Tree = () => {
    const treeData = useMemo(() => buildTree(nodes), []);

    return (
        <div className="space-y-10">
            {treeData.map((item) => (
                <div key={item.id} className="bg-slate-200 shadow p-5">
                    {/* Parent */}
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src="https://img.freepik.com/premium-vector/cute-banana-cartoon-vector-icon-illustration-logo-mascot-hand-drawn-concept-trandy-cartoon_519183-187.jpg?w=360" />
                            <AvatarFallback>Mr Banana</AvatarFallback>
                        </Avatar>
                        <div className="">
                            <div className="text-xl font-medium">
                                Mr. Banana:{" "}
                                <span className="text-red-500">
                                    {item.result_value}
                                </span>
                            </div>
                        </div>
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
