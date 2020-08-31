import React, {useEffect, useState} from 'react';
import {PersonalDetails} from "../types/PersonalDetails";
import "../styles/personal-details.css"
import infinSpinner from "../Infinity-1.1s-200px.gif"
import errorImage from "../error.png"
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {Button} from "@material-ui/core";
import {
    callFindPersonIndex,
    callUpdateLedgerTest,
    getPersonalDetailsForCustomerOnSite
} from "../api_util/callApiEndpoints";


export interface PersonalDetailProps {
    accountId: string,
    name: string,
    forename: string
}


const PersonalDetailSettings = ({accountId, name, forename, history}: PersonalDetailProps & RouteComponentProps) => {

    const [callUpdate, setCallUpdate]: [boolean, any] = useState(false);
    const [personFetched, setPersonFetched]: [boolean, any] = useState(false);
    const [personalDetails, setPersonalDetails]: [PersonalDetails | null, any] = useState(null)
    const [personIndex, setPersonIndex]: [number, any] = useState(-1)
    const [doLoad, setShowSpinner]: [boolean, any] = useState(true)
    const [error, setError]: [boolean, any] = useState(false)


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


    useEffect(() => {
        async function fetchCorrectPersonalDetails() {
            const index = await callFindPersonIndex(accountId, name, forename);
            setPersonIndex(index)
            const details = await getPersonalDetailsForCustomerOnSite(accountId, index);
            setPersonalDetails(details)
        }

        setTimeout((() => fetchCorrectPersonalDetails()
            .then(() => setPersonFetched(true))
            .then(() => setShowSpinner(false))
            .catch((err) => {
                setError(true)
                setShowSpinner(false)
            })), 100)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [personFetched])

    useEffect(() => {
        async function fetchUpdate() {
            const isUpdateComplete = await callUpdateLedgerTest(accountId, name, forename);
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
    }, [accountId, callUpdate, forename, name])

    if (!doLoad &&
        personFetched &&
        !error && personalDetails !== null)
        return (
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
                <Button onClick={() => {
                    setShowSpinner(true)
                    setCallUpdate(true)
                }}> Teste Update-Ledger API
                </Button>
                <Button onClick={() => {
                    callCreateTestAccount(1)
                }}>Erstelle Test-User 1
                </Button>
                <Button onClick={() => {
                    callCreateTestAccount(2)
                }}>Erstelle Test-User 2
                </Button>
                <Button onClick={() => {
                    history.push("/personal2")
                }}>Zu Test-User 1
                </Button>
                <Button onClick={() => {
                    history.push("/personal3")
                }}>Zu Test-User 2
                </Button>
            </div>
        )

    if (!error && doLoad) {
        return (
            <img style={{marginTop: "20%"}} src={infinSpinner}/>
        )
    }
    if (error) {
        return (
            <React.Fragment>
                {
                    error &&
                    <div className={"resource-missing"}>
                        <h1>RESSOURCE NICHT VORHANDEN!</h1>
                        <img src={errorImage} width={200} height={200}/>
                        <Button><Link to={"/personal"}>Zur initialen Ressource</Link></Button>
                        <Button><Link to={"/"}>Zurück zu Home</Link></Button>
                    </div>
                }
            </React.Fragment>
        );
    }

    return (
        <div className={"personal-settings"}></div>
    )
};

export default withRouter(PersonalDetailSettings);