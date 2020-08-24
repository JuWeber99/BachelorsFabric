import React, {useEffect, useState} from 'react';
import {PersonalDetails} from "../types/PersonalDetails";
import "../styles/personal-details.css"
import {CustomerAccount} from "../types/CustomerAccountAsset";
import loadingSpinner from "../Spinner-1s-200px.gif"

export interface PersonalDetailSettingProps {
    accountId: string,
    name: string,
    forename: string
}


const PersonalDetailSettings = ({accountId, name, forename}: PersonalDetailSettingProps) => {

    const [callApi, setCallApi]: [boolean, any] = useState(false);
    const [personFetched, setPersonFetched]: [boolean, any] = useState(false);
    const [personalDetails, setPersonalDetails]: [PersonalDetails | null, any] = useState(null)

    function callUpdateLedgerTest() {
        fetch("http://localhost:3031/api/changeCustomerAddress")
            .then((response) => {
                if (response.status === 200)
                    return response.json()
            })
            .then((customerAccount: CustomerAccount) =>
                setPersonalDetails(customerAccount.personalDetails))
            .catch((err) => {
                return new Error("ERROR" + err);
            })
    }

    const callCreateTestAccount = () => {
        fetch("http://localhost:3031/api/createTestAccount")
            .then((response) => {
                if (response.status === 200)
                    return response.text()
            }).then((responseText) =>
            console.log(responseText)
        ).catch((err) => {
            return new Error("ERROR" + err);
        })
    }

    function callReadCustomerAccount(accountId: string) {
        console.log("url: "+`http://localhost:3031/api/readCustomerAccount/${accountId}`)
        fetch(`http://localhost:3031/api/readCustomerAccount/${accountId}`)
            .then((response) => {
                if (response.status === 200)
                    console.log(response.json())
                return response.json()
            }).then((customerAccount: CustomerAccount) => {
                setPersonalDetails(customerAccount.personalDetails)
                setPersonFetched(true)
                console.log("success fetching data")
            }
        ).catch((err) => {
            return new Error("ERROR" + err);
        })
    }


    function callReadInitial() {
        fetch(`http://localhost:3031/api/readInitialLedger`)
            .then((response) => {
                console.log(response)
                if (response.status === 200)
                    console.log(response.json())
                return response.json()
            }).then((customerAccount: CustomerAccount) => {
                setPersonalDetails(customerAccount.personalDetails)
                setPersonFetched(true)
                console.log("success fetching data")
            }
        ).catch((err) => {
            return new Error("ERROR" + err);
        })
    }

    useEffect(() => {
        console.log("personal detail rendereo")
        if (callApi) {
            callUpdateLedgerTest()
            setCallApi(false)
        }
    }, [callApi])


    useEffect(() => {
        if (!personFetched) {
            console.log("get Personal Details")
            // callReadCustomerAccount(accountId)
            callReadInitial()
            console.log("person is fetched")
        }
    })


    return (
        <React.Fragment>
            {
                personFetched &&
                <div className={"personal-settings"}>
                    <h1> Persönliche Informationen </h1>
                    <ul>
                        <p><b>Familienname: {personalDetails!.name}</b></p>
                        <p><b>Vorname: {personalDetails!.forename}</b></p>
                        <p><b>Geburtstag: </b> {[personalDetails!.birthday.getDay(),
                            personalDetails!.birthday.getMonth(),
                            personalDetails!.birthday.getFullYear()].join(".")} </p>
                        <p><b>Ländercode: </b> {personalDetails!.address.country} </p>
                        <p><b>E-Mail Adresse: </b> {personalDetails!.mailAddress} </p>
                        <p><b>Telefonnummer: </b> {personalDetails!.telephoneContact} </p>
                        <p>
                            <b> PLZ/Stadt: </b>{personalDetails!.address.postalCode} - {personalDetails!.address.residence}
                        </p>
                        <p>
                            <b>Straße/Hausnummer: </b> {personalDetails!.address.streetName} - {personalDetails!.address.houseNumber}
                        </p>
                    </ul>
                    <button onClick={() => console.log("clock")}> Teste Update-Ledger API</button>
                </div>
            }
            {
                !personFetched &&
                <img src={loadingSpinner}/>
            }
        </React.Fragment>
    );
};

export default PersonalDetailSettings;