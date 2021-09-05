import React from "react";
import PrivateRoute from "../../routes/privateRoute";
import TestPlan from "./test-plan";
import ExecuteTestPlan from "./execute-test-plan";
import {Switch, useRouteMatch} from "react-router-dom";


export default function TestPlanHome(){
    const {path} = useRouteMatch()
    return <React.Fragment>
        <Switch>
            <PrivateRoute component={TestPlan} path={`${path}/test-plan`}/>
            <PrivateRoute component={ExecuteTestPlan} path={`${path}/test-plan-execute`}/>
        </Switch>
    </React.Fragment>


}
