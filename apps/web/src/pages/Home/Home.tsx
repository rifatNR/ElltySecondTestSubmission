import useAuth from "@/utils/hooks/useAuth";
import React from "react";

const Home = () => {
    const { authUser } = useAuth();

    return <div className="pb-20">Home</div>;
};

export default Home;
