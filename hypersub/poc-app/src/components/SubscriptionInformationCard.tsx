import React, {useEffect, useState} from 'react';
import "../styles/subscription-card.css"
import {Subscription} from "../types/Susbcription";
import infinSpinner from "../Infinity-1.1s-200px.gif";
import errorImage from "../error.png";
import {Button} from "@material-ui/core";
import {Link} from "react-router-dom";
import {getCustomerDetails} from "../api_util/callApiEndpoints";

export interface SubscriptionProps {
    accountId: string
}
// WASTE
const SubscriptionInformationCard = ({accountId}: SubscriptionProps) => {
    const [isLoading, setLoading]: [boolean, any] = useState(true)
    const [error, setError]: [boolean, any] = useState(false)
    const [subscriptionContract, setSubscriptionContract]: [Subscription | null, any] = useState(null)

    useEffect(() => {
        async function fetchCustomer() {
            const customer = await getCustomerDetails(accountId);
            setSubscriptionContract(customer.simDetails)
        }

        if (subscriptionContract === null) {
            fetchCustomer()
                .then(() => setLoading(false))
                .catch(() => setError(true))
        }
    }, [accountId, subscriptionContract])


    if (isLoading) {
        return (
            <img style={{marginTop: "20%"}} src={infinSpinner}/>
        )
    }

    if (error) {
        return (
            <div className={"resource-missing"}>
                <h1>RESSOURCE NICHT VORHANDEN!</h1>
                <img src={errorImage} width={200} height={200}/>
                <Button><Link to={"/"}>Zurück zu Home</Link></Button>
            </div>
        )
    }

    return (
        <div className={"subscription-card"}>
            <h3>{subscriptionContract!.subscriptionProduct.productType}</h3>
            <h3>Produkt-Kennung: {subscriptionContract!.subscriptionProduct.productId} </h3>
            <h3>Kosten: {subscriptionContract!.subscriptionProduct.cost}€</h3>
            <h3>Start-Datum: {subscriptionContract!.startDate.toString()} </h3>
            <h3>End-Datum: {subscriptionContract!.endDate.toString()} </h3>
            <h3>Rechnungszyklus in Wochen: {Math.round(subscriptionContract!.billingPeriod.asWeeks())} </h3>
        </div>
    );
};

export default SubscriptionInformationCard;