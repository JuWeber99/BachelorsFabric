import React from 'react';
import './styles/App.css';
import "./styles/payment-success.css"
import {Payment} from "./components/Payment";
import {Link, Route, Switch} from "react-router-dom"
import Home from "./components/Home";
import SubscriptionInformationCard from "./components/SubscriptionInformationCard";
import {testAccounts, testContract} from "./testing/initialTestLedger";
import PersonalDetailSettings from "./components/PersonalDetailSettings";
import AllCustomerDetails from "./components/AllCustomerDetails";

function App() {
    return (
        <div className={"app-container"}>
            <Switch>
                <Route exact path={"/"}>
                    <Home/>
                </Route>
                <Route exact path={"/data"}>
                    <AllCustomerDetails accountId={testAccounts.accountId}/>
                </Route>
                <Route exact path={"/infoCard"}>
                    <SubscriptionInformationCard subscriptionContract={testContract}/>
                </Route>
                <Route exact path={"/personal"}>
                    <PersonalDetailSettings
                        key={testAccounts.accountId}
                        accountId={testAccounts.accountId}
                        name={testAccounts.personalDetails[0].name}
                        forename={testAccounts.personalDetails[0].forename}/>
                </Route>
                <Route exact path={"/personal2"}>
                    <PersonalDetailSettings
                        key={"guhidasfg238r766grzseugc97dsaftg67sadfadsf23"}
                        accountId={"guhidasfg238r766grzseugc97dsaftg67sadfadsf23"}
                        name={testAccounts.personalDetails[0].name}
                        forename={testAccounts.personalDetails[0].forename}/>
                </Route>
                <Route exact path={"/personal3"}>
                    <PersonalDetailSettings
                        key={"aaabbbcccdddeeefasdfhcsiqkfhjasdf"}
                        accountId={"aaabbbcccdddeeefasdfhcsiqkfhjasdf"}
                        name={testAccounts.personalDetails[0].name}
                        forename={testAccounts.personalDetails[0].forename}/>
                </Route>
                <Route exact path={"/payment"}>
                    <Payment subscriptionContract={testContract}/>
                </Route>
            </Switch>

            <button className={"tohome-btn"}> <Link to={"/"}> Hier gehts "nach Hause" </Link></button>
        </div>
    );
}

export default App;
