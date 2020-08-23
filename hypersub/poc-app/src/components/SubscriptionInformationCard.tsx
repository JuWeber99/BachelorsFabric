import React from 'react';
import "../styles/subscription-card.css"
import {Subscription} from "../types/Susbcription";

export interface  SubscriptionInformationCardProps {
    contract: Subscription
}

const SubscriptionInformationCard = ({contract}: SubscriptionInformationCardProps) => {
    return (
        contract &&
        <div className={"subscription-card"}>
            <h1>Details for subscription</h1>
            <ul className={"subscription-detail"}>
                {contract.contractId}
            </ul>
            <ul className={"subscription-detail"}>
                {contract.billingPeriod.toISOString()}
            </ul>
            <ul className={"subscription-detail"}>
                {contract.cancellationPeriod.toISOString()}
            </ul>
            <ul className={"subscription-detail"}>
                {JSON.stringify(contract.isActive)}
            </ul>
            <ul className={"subscription-detail"}>
                {contract.startDate.toString()}
            </ul>
            <ul className={"subscription-detail"}>
                {contract.endDate!.toString()}
            </ul>
            <ul className={"subscription-detail"}>
                {JSON.stringify(contract.subscriptionProduct)}
            </ul>
            <ul className={"subscription-detail"}>
                {JSON.stringify(contract.bookedOptions)}
            </ul>

        </div>
    );
};

export default SubscriptionInformationCard;