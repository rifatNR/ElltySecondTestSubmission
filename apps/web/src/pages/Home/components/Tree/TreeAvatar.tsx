import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarFallback } from "@/utils/helper";

import React from "react";

type Props = {
    username: string;
};
const TreeAvatar = ({ username }: Props) => {
    return (
        <Avatar className="h-8 w-8">
            {/* <AvatarImage src="https://img.freepik.com/premium-vector/cute-banana-cartoon-vector-icon-illustration-logo-mascot-hand-drawn-concept-trandy-cartoon_519183-187.jpg?w=360" /> */}
            <AvatarFallback className="bg-black text-white">
                {getAvatarFallback(username)}
            </AvatarFallback>
        </Avatar>
    );
};

export default TreeAvatar;
