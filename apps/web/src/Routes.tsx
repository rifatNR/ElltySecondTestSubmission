import Layout from "@/layouts/Layout";
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
import Home from "@/pages/Home/Home";
import React from "react";
import { Route, Switch } from "wouter";

const Routes = () => {
    return (
        <Switch>
            <Route path="/auth/login" component={Login} />
            <Route path="/auth/signup" component={Signup} />

            <Layout>
                <Route path="/" component={Home}></Route>
            </Layout>

            <Route path="/users/:name">
                {(params) => <>Hello, {params.name}!</>}
            </Route>

            <Route>404: No such page!</Route>
        </Switch>
    );
};

export default Routes;
