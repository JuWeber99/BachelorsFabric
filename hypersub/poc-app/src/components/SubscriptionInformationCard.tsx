import React from 'react';
import "../styles/subscription-card.css"
import {Subscription} from "../types/Susbcription";

export interface SubscriptionProps {
    subscriptionContract: Subscription
}

const SubscriptionInformationCard = ({subscriptionContract}: SubscriptionProps) => {
    return (
        <div className={"subscription-card"}>
            <h3>{subscriptionContract.subscriptionProduct.productType}</h3>
            <h3>Produkt-Kennung: {subscriptionContract.subscriptionProduct.productId} </h3>
            <h3>Kosten: {subscriptionContract.subscriptionProduct.cost}€</h3>
            <h3>Start-Datum: {subscriptionContract.startDate.toString()} </h3>
            <h3>End-Datum: {subscriptionContract.endDate.toString()} </h3>
            <h3>Rechnungszyklus in Wochen: {Math.round(subscriptionContract.billingPeriod.asWeeks())} </h3>
        </div>
    );
};

export default SubscriptionInformationCard;