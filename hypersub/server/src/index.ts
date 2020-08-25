import express from "express";
import cors from "cors"
import {populateNetworkConnection} from "./NetConnection";
import {ChainCodeCaller} from "./ChaincodeCaller";
import {Stripe} from "stripe"

var stripe = new Stripe('sk_test_51HJpsyGLRl9OMbnVDfUbtvIbo9zZiy1af7oGJIqYmEMkb5fEE1PDFu3o1RMTHYJrGeNZHIObb6TOkDeDQWkFzm3T00OxXXxlVu',
        {
            apiVersion: "2020-03-02",
        });

const app = express();
process.title = "poc-server";
app.use(cors())


app.get("/api/changeCustomerAddress", async (req, res) => {
    try {
        const network = await populateNetworkConnection();
        const caller = new ChainCodeCaller(network);
        await caller.changeCustomerAddressTest();
        res.status(200).send("Changed Address!")
        caller.disconnect();
    } catch (apiError) {
        res.status(400).send(apiError)
    }
})


app.get("/api/changeCustomerAddress/:accountId/:name/:forename", async (req, res) => {
    try {
        const network = await populateNetworkConnection();
        const caller = new ChainCodeCaller(network);
        await caller.changeCustomerAddressFor(req.params.accountId, req.params.name, req.params.forename);
        res.status(200).send("Changed Address!")
        caller.disconnect();
    } catch (apiError) {
        res.status(400).send(apiError)
    }
})


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
        const result = await caller.readCustomerAccount(req.params.accountId);
        res.status(200).json(result)
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
app.get('/api/findPersonalDetailIndex/:accountId/:name/:forename', async (req, res) => {
    try {
        const network = await populateNetworkConnection();
        const caller = new ChainCodeCaller(network);
        const result = await caller.findPersonalDetailIndex(req.params.accountId, req.params.name, req.params.forename);
        res.status(200).json(result)
        caller.disconnect();
    } catch (apiError) {
        res.status(400).send(apiError)
    }
})


app.get("/", (req, res) => {
    res.send("Hello")
})


app.post('/sub', async (req, res) => {
    const {email, payment_method} = req.body;

    const customer = await stripe.customers.create({
        payment_method: payment_method,
        email: email,
        invoice_settings: {
            default_payment_method: payment_method,
        },
    });

    const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{plan: 'prod_HtdGtm65srvqmm'}],
        expand: ['latest_invoice.payment_intent']
    });

    const status = subscription['latest_invoice']['payment_intent']['status']
    const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']

    res.json({'client_secret': client_secret, 'status': status});
})


app.listen(3031);