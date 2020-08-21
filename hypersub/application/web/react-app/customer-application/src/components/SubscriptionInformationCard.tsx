import React from 'react';
import {Subscription} from "../../../../../types/Susbcription";
import "../styles/subscription-card.css"

const SubscriptionInformationCard = (contract : Subscription) => {
    return (
        contract &&
        <div>
            <h1>Details for subscription</h1>
            <ul>
                <ul className={"subscription-detail"}>
                    {contract.contractId}
                </ul>

                <ul className={"subscription-detail"}>
                    {contract.billingPeriod}
                </ul>

                <ul className={"subscription-detail"}>
                    {contract.cancellationPeriod}
                </ul>


                <ul className={"subscription-detail"}>
                    {contract.isActive}
                </ul>

                <ul className={"subscription-detail"}>
                    {contract.bookedOptions}
                </ul>


                <ul className={"subscription-detail"}>
                    {contract.startDate}
                </ul>

                <ul className={"subscription-detail"}>
                    {contract.endDate}
                </ul>

                <ul className={"subscription-detail"}>
                    {JSON.stringify(contract.subscriptionProduct)}
                </ul>
            </ul>
        </div>
    );
};

export default SubscriptionInformationCard;