import React, {useEffect, useState} from 'react';
import {CustomerAccount} from "../types/CustomerAccountAsset";
import "../styles/personal-details.css"
import errorImage from "../error.png";
import {Link} from "react-router-dom";
import infinSpinner from "../Infinity-1.1s-200px.gif";

export interface AllCustomerDetailsProps {
    accountId: string
}

export const AllCustomerDetails = ({accountId}: AllCustomerDetailsProps) => {
    const [isLoading, setLoading]: [boolean, any] = useState(true)
    const [error, setError]: [boolean, any] = useState(false)
    const [customerDetails, setCustomerDetails]: [CustomerAccount | null, any] = useState(null)

    async function getCustomerDetails(accountId: string): Promise<CustomerAccount> {
        const customerAccount = await fetch(`http://localhost:3031/api/readCustomerAccount/${accountId}`)
            .then((response) => response.json())
            .then((customerAccount: CustomerAccount) => customerAccount);
        return customerAccount;
    }

    useEffect(() => {
        async function fetchCustomer() {
            setLoading(true)
            const customer = await getCustomerDetails(accountId);
            setCustomerDetails(customer)
        }

        if (customerDetails === null) {
            fetchCustomer()
                .then(() => setLoading(false))
                .catch(() => setError(true))
        }
    }, [accountId, customerDetails])


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
                <button><Link to={"/"}>Zurück zu Home</Link></button>
            </div>
        )
    }

    return (
        <div className={"personal-settings"}>
            <h1> Alle Details zum Nutzer mit ID: {accountId}</h1>
            {!isLoading &&
            <p>{JSON.stringify(customerDetails)}</p>
            }
        </div>
    )
};

export default AllCustomerDetails;