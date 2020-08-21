import React from 'react';
import {Link} from "react-router-dom";

const Home = () => {
    return (
        <div style={{display: "block"}}>
            <h1> This is the Homepage </h1>
            <ul>
                <ul>
                    <Link to={"/payment"}> Go to payment for the test subscription! </Link>
                </ul>
                <ul>
                    <Link to={"/test"}> Go to list test! </Link>
                </ul>
            </ul>
        </div>
    );
};

export default Home;