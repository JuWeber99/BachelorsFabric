import React from 'react';
import {Link, Redirect, withRouter} from "react-router-dom";
import "../styles/home.css"


const Home = (props: any) => {
    return (
        <div className={"home"}>
            <h1 style={{marginBottom: "0"}}> Willkommen zur PoC Applikation</h1>
            <h3><u>Bachelorarbeit von Julian Weber</u></h3>
            <div className={"home-buttons"}>
                <button onClick={() => props.history.push("payment")}> Zur PayPal-Integration für Zahlungen</button>
                <button onClick={() => props.history.push("personal")}> Zur Ansicht der Persönlichen Informationen
                </button>
                <button onClick={() => props.history.push("infoCard")}> Zur Vertragsübersicht</button>
                <button onClick={() => props.history.push("/data")}> Alle Daten für initialen Testuser </button>
            </div>
        </div>
    );
};

export default withRouter(Home);