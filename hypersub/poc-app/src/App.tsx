import React from 'react';
import './styles/App.css';
import chair from './chair.jpg';
import "./styles/payment-success.css"
import {Payment} from "./components/Payment";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom"
import Home from "./components/Home";
import SubscriptionInformationCard from "./components/SubscriptionInformationCard";
import {testContract} from "./testing/initialTestLedger";

function App() {
    const product = {
        price: 777.77,
        name: 'comfy chair',
        description: 'fancy chair, like new',
        image: chair,
    };


    return (
        <div className={"app-container"}>
            <Switch>
                <Route exact path={"/payment"}>
                    <Payment product={product}/>
                </Route>
                <Route exact path={"/"}>
                    <Home/>
                </Route>
                <Route exact path={"/test"}>
                    <SubscriptionInformationCard contract={testContract} />
                </Route>
            </Switch>
        </div>
    );
}

export default App;
