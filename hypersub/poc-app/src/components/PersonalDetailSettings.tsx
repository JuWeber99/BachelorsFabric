import React from 'react';
import {PersonalDetails} from "../types/PersonalDetails";
import "../styles/personal-details.css"

export interface PersonalDetailSettingProps {
    details: PersonalDetails
}

const callUpdateLedgerTest = () => {
    fetch("/api/updateTest", {
    }).then((response) => console.log(response))
        .catch((err) => console.log(err))
}


const PersonalDetailSettings = ({details}: PersonalDetailSettingProps) => {
    return (
        <React.Fragment>
            <div className={"personal-settings"}>
                <h1> Persönliche Informationen </h1>
                <ul>

                    <p><b>Familienname: {details.name}</b></p>
                    <p><b>Vorname: {details.forename}</b></p>
                    <p><b>Geburtstag: </b> {[details.birthday.getDay(),
                        details.birthday.getMonth(),
                        details.birthday.getFullYear()].join(".")} </p>
                    <p><b>Ländercode: </b> {details.address.country} </p>
                    <p><b>E-Mail Adresse: </b> {details.mailAddress} </p>
                    <p><b>Telefonnummer: </b> {details.telephoneContact} </p>
                    <p><b> PLZ/Stadt: </b>{details.address.postalCode} - {details.address.residence} </p>
                    <p><b>Straße/Hausnummer: </b> {details.address.streetName} - {details.address.houseNumber} </p>
                </ul>
                <button onClick={callUpdateLedgerTest}> Teste Update-Ledger API</button>
            </div>
        </React.Fragment>
    );
};

export default PersonalDetailSettings;