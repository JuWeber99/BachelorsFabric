import React, {useEffect, useState} from 'react';
import {PersonalDetails} from "../types/PersonalDetails";
import "../styles/personal-details.css"
import {CustomerAccount} from "../types/CustomerAccountAsset";
import infinSpinner from "../Infinity-1.1s-200px.gif"
import errorImage from "../error.png"
import {Link} from "react-router-dom";


export interface PersonalDetailSettingProps {
    accountId: string,
    name: string,
    forename: string
}


const PersonalDetailSettings = ({accountId, name, forename}: PersonalDetailSettingProps) => {

    const [callUpdate, setCallUpdate]: [boolean, any] = useState(false);
    const [personFetched, setPersonFetched]: [boolean, any] = useState(false);
    const [personalDetails, setPersonalDetails]: [PersonalDetails | null, any] = useState(null)
    const [personIndex, setPersonIndex]: [number, any] = useState(-1)
    const [doLoad, setShowSpinner]: [boolean, any] = useState(true)
    const [error, setError]: [boolean, any] = useState(false)

    async function callFindPersonIndex(accountId: string, name: string, forename: string): Promise<number> {
        let personIndex = await fetch(`http://localhost:3031/api/findPersonalDetailIndex/${accountId}/${name}/${forename}`)
            .then((response) => response.json())
            .then((personIndex: number) => personIndex)
        return personIndex;
    }

    function callCreateTestAccount(oneOrTwo: 1 | 2): Promise<boolean> {
        let path = ""
        switch (oneOrTwo) {
            case 1:
                path = "createTestAccount";
                break
            case 2:
                path = "ct2"
        }
        let success = fetch(`http://localhost:3031/api/${path}`)
            .then((response) => response.ok)
        return success;
    }


    async function getPersonalDetailsForCustomerOnSite(accountId: string, personIndex: number): Promise<PersonalDetails> {
        let result = await fetch(`http://localhost:3031/api/readCustomerAccount/${accountId}`)
            .then((response) => response.json())
            .then((customerAccount: CustomerAccount) => customerAccount.personalDetails[personIndex])
        return result
    }

    async function callUpdateLedgerTest(): Promise<boolean> {
        let success = await fetch(`http://localhost:3031/api/changeCustomerAddress/${accountId}/${name}/${forename}`)
            .then((response) => response.ok)
        console.log(success)
        return success;
    }

    useEffect(() => {
        async function fetchCorrectPersonalDetails() {
            const index = await callFindPersonIndex(accountId, name, forename);
            setPersonIndex(index)
            const details = await getPersonalDetailsForCustomerOnSite(accountId, index);
            setPersonalDetails(details)
        }

        fetchCorrectPersonalDetails()
            .then(() => setPersonFetched(true))
            .then(() => setShowSpinner(false))
            .catch((err) => {
                setError(true)
                setShowSpinner(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [personFetched])

    useEffect(() => {
        async function fetchUpdate() {
            const isUpdateComplete = await callUpdateLedgerTest();
            setCallUpdate(false)
        }

        if (callUpdate) {

            fetchUpdate()
                .then(() => setPersonFetched(false))
                .catch((err) => {
                    setError(true)
                    setShowSpinner(false)
                })
        }
    }, [callUpdate, callUpdateLedgerTest])


    return (
        <React.Fragment>
            {
                !doLoad &&
                personFetched &&
                !error &&
                <div className={"personal-settings"}>
                    <h1> Persönliche Informationen </h1>
                    <ul>
                        <p><b>Familienname: {personalDetails!.name}</b></p>
                        <p><b>Vorname: {personalDetails!.forename}</b></p>
                        {/*<p><b>Geburtstag: </b> {[personalDetails!.birthday.getDay().toString(),*/}
                        {/*    personalDetails!.birthday.getMonth().toString(),*/}
                        {/*    personalDetails!.birthday.getFullYear()].join(".")} </p>*/}
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
                    <button onClick={() => {
                        setShowSpinner(true)
                        setCallUpdate(true)
                    }}> Teste Update-Ledger API
                    </button>
                    <button onClick={() => callCreateTestAccount(1)}> Erstelle Test-User 1</button>
                    <button onClick={() => callCreateTestAccount(2)}> Erstelle Test-User 2</button>
                </div>
            }
            {
                !error && doLoad && <img style={{marginTop: "20%"}} src={infinSpinner}/>
            }
            {
                error &&
                    <div className={"resource-missing"}>
                        <h1>RESSOURCE NICHT VORHANDEN!</h1>
                        <img src={errorImage} width={200} height={200}/>
                        <button> <Link to={"/personal"}>Zur initialen Ressource</Link> </button>
                        <button> <Link to={"/home"}>Go back Home</Link> </button>
                    </div>

            }
        </React.Fragment>
    );
};

export default PersonalDetailSettings;