import express from "express";
import cors from "cors"
import {populateNetworkConnection} from "./NetConnection";
import {ChainCodeCaller} from "./ChaincodeCaller";

const app = express();
process.title = "poc-server";
app.use(cors())


app.get("/api/changeCustomerAddress", async (req, res) => {
    try {
        const network = await populateNetworkConnection();
        const caller = new ChainCodeCaller(network);
        await caller.changeCustomerAddress();
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


app.get('/api/ct2', async (req, res) => {
    try {
        const network = await populateNetworkConnection();
        const caller = new ChainCodeCaller(network);
        await caller.createCustomerTestAccountTwo();
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
        const result = caller.readCustomerAccount("5d60f057f5294daa7aee33183d3252d1fa78a64da3aee5d8dbdebcbc24c3b809");
        res.status(200).json(result)
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
        res.status(200).json(result)
        caller.disconnect();
    } catch (apiError) {
        res.status(400).send(apiError)
    }
})
app.get('/api/getPersonFromCustomerAccount/:accountId/:name/:forename', async (req, res) => {
    try {
        const network = await populateNetworkConnection();
        const caller = new ChainCodeCaller(network);
        const result = await caller.getPersonFromCustomerAccount(req.params.accountId, req.params.name, req.params.forename);
        res.status(200).json(result)
        caller.disconnect();
    } catch (apiError) {
        res.status(400).send(apiError)
    }
})

app.get("/", (req, res) => {
    res.send("Hello World")
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