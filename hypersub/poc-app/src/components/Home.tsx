import React from 'react';
import {withRouter} from "react-router-dom";
import "../styles/home.css"
import {Button} from "@material-ui/core";
import {RouterProps} from "react-router";


const Home = (props: RouterProps) => {
    return (
        <div className={"home"}>
            <h1 style={{marginBottom: "0"}}> Willkommen zur PoC Applikation</h1>
            <h3><u>Bachelorarbeit von Julian Weber</u></h3>
            <div className={"home-buttons"}>
                <Button onClick={() => props.history.push("stripe")}> Zur Stripe-Integration für Subscription-Bezahlungen</Button>
                <Button onClick={() => props.history.push("personal")}> Zur Ansicht der Persönlichen Informationen
                </Button>
                <Button onClick={() => props.history.push("/data")}> Alle Daten für initialen Testuser </Button>
            </div>
        </div>
    );
};

export default withRouter(Home);