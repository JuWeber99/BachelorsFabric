import React from 'react';
import './styles/App.css';
import "./styles/payment-success.css"
import {Payment} from "./components/Payment";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom"
import Home from "./components/Home";
import SubscriptionInformationCard from "./components/SubscriptionInformationCard";
import {testContract, testPersonalDetails} from "./testing/initialTestLedger";
import PersonalDetailSettings from "./components/PersonalDetailSettings";

function App()
{
    const product = {
        price: 777.77,
        name: 'comfy chair',
        description: 'fancy chair, like new',
    };


    return (
        <div className={"app-container"}>
            <Switch>
                <Route exact path={"/payment"}>
                    <Payment subscriptionContract={testContract}/>
                </Route>
                <Route exact path={"/"}>
                    <Home/>
                </Route>
                <Route exact path={"/test"}>
                    <SubscriptionInformationCard subscriptionContract={testContract} />
                </Route>
                <Route exact path={"/updateTest"}>
                    <PersonalDetailSettings details={testPersonalDetails}/>
                </Route>
            </Switch>
        </div>
    );
}

export default App;
