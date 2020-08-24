import React from 'react';
import './styles/App.css';
import "./styles/payment-success.css"
import {Payment} from "./components/Payment";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom"
import Home from "./components/Home";
import SubscriptionInformationCard from "./components/SubscriptionInformationCard";
import {testAccounts, testContract, testPersonalDetails} from "./testing/initialTestLedger";
import PersonalDetailSettings, {PersonalDetailSettingProps} from "./components/PersonalDetailSettings";

function App() {
    return (
        <div className={"app-container"}>
            <Switch>
                <Route exact path={"/"}>
                    <Home/>
                </Route>
                <Route exact path={"/infoCard"}>
                    <SubscriptionInformationCard subscriptionContract={testContract}/>
                </Route>
                <Route exact path={"/personal"}>
                    <PersonalDetailSettings
                        accountId={testAccounts.accountId}
                        name={testAccounts.personalDetails[0].name}
                        forename={testAccounts.personalDetails[0].forename}/>
                </Route>
                <Route exact path={"/personal2"}>
                    <PersonalDetailSettings
                        accountId={"guhidasfg238r766grzseugc97dsaftg67sadfadsf23"}
                        name={testAccounts.personalDetails[0].name}
                        forename={testAccounts.personalDetails[0].forename}/>
                </Route>
                <Route exact path={"/personal3"}>
                    <PersonalDetailSettings
                        accountId={"aaabbbcccdddeeefasdfhcsiqkfhjasdf"}
                        name={testAccounts.personalDetails[0].name}
                        forename={testAccounts.personalDetails[0].forename}/>
                </Route>
                <Route exact path={"/payment"}>
                    <Payment subscriptionContract={testContract}/>
                </Route>
            </Switch>
        </div>
    );
}

export default App;
