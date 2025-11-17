import Tree from "@/pages/Home/components/Tree/Tree";
import MainPostForm from "@/pages/Home/MainPostForm";
import useAuth from "@/utils/hooks/useAuth";
import React from "react";

const Home = () => {
    const { authUser } = useAuth();

    return (
        <div className="pb-20">
            <MainPostForm />
            <Tree />
        </div>
    );
};

export default Home;
