import express from "express";
import cors from "cors"
import bodyParser from "body-parser"
import {populateNetworkConnection} from "./NetConnection";
import {ChainCodeCaller} from "./ChaincodeCaller";
import fs from "fs";
import {ccpPath} from "./enrollAdmin";
import path from "path";
import {Gateway, Wallets} from "fabric-network";

const app = express();
process.title = "poc-server";
app.use(cors())


app.get("/api/changeCustomerAddress", async (req, res) => {
    try {
        const network = await populateNetworkConnection();
        const caller = new ChainCodeCaller(network);
        const result = await caller.changeCustomerAddress();
        res.status(200).send("Changed Address!")
        caller.disconnect();
    } catch (apiError) {
        res.status(400).send(apiError)
    }
})
// /:accountId/:name/:forename

app.get('/api/createTestAccount', async (req, res) => {
    try {
        const network = await populateNetworkConnection();
        const caller = new ChainCodeCaller(network);
        await caller.createCustomerTestAccount();
        res.status(200).send("Test Account created")
        caller.disconnect();
    } catch (apiError) {
        res.status(400).send(apiError)
    }
})


app.get('/api/createTestAccountTwo', async (req, res) => {
    try {
        const network = await populateNetworkConnection();
        const caller = new ChainCodeCaller(network);
        await caller.createCustomerTestAccount();
        res.status(200).send("Test Account created")
        caller.disconnect();
    } catch (apiError) {
        res.status(400).send(apiError)
    }
})


app.get('/api/readCustomerAccount/:accountId', async (req, res) => {
    try {
        const network = await populateNetworkConnection();
        const caller = new ChainCodeCaller(network);
        const result = caller.readCustomerAccount(req.params.accountId);
        res.status(200).json()
        console.log("readCustomerAccount successfully")
        caller.disconnect();
    } catch (apiError) {
        res.status(400).send(apiError)
    }
})

app.get('/api/readInitialLedger', async (req, res) => {
    try {
        const network = await populateNetworkConnection();
        const caller = new ChainCodeCaller(network);
        const result = await caller.readInitialLedger();
        res.status(200).json(JSON.parse(result))
        caller.disconnect();
    } catch (apiError) {
        res.status(400).send(apiError)
    }
})

// app.get('/api/readInitialWithoutPromise', (req, res) => {
//     populateNetworkConnection().then((network) =>
//         new ChainCodeCaller(network))
//         .then((caller) => caller.readInitialLedger())
//         .then((response) => {
//             res.status(200).json(JSON.parse(response))
//         }).catch((apiError) => {
//         res.status(400).send(apiError)
//     })
//     // caller.disconnect();
// })




app.listen(3031);