import React from 'react';
import './styles/App.css';
import "./styles/payment-success.css"
import {InstantCheckout} from "./components/InstantCheckout";
import {Link, Route, Switch} from "react-router-dom"
import Home from "./components/Home";
import SubscriptionInformationCard from "./components/SubscriptionInformationCard";
import {testAccounts, testContract} from "./testing/initialTestLedger";
import PersonalDetailSettings from "./components/PersonalDetailSettings";
import AllCustomerDetails from "./components/AllCustomerDetails";
import {Button} from "@material-ui/core";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import {SubscriptionCheckout} from "./components/StripeCheckout";

const stripePromise = loadStripe("pk_test_51HJpsyGLRl9OMbnVYEBLVhqQtpP0uW1AZRUEYitU8IeqWILXRNeUz3v3nUtFoTjakB7qgJiG5F8uBFPXgTLKHAc1002ZXeeV6j");

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
                <Route exact path={"/paypal"}>
                    <InstantCheckout subscriptionContract={testContract}/>
                </Route>
                <Route exact path={"/stripe"}>
                    <Elements stripe={stripePromise}>
                        <SubscriptionCheckout key={testAccounts.accountId}
                                              accountId={testAccounts.accountId}
                                              name={testAccounts.personalDetails[0].name}
                                              forename={testAccounts.personalDetails[0].forename}/>
                    </Elements>
                </Route>
            </Switch>
            <Button color={"primary"} className={"btn"}> <Link to={"/"}> Hier gehts "nach Hause" </Link></Button>
        </div>

    );
}

export default App;