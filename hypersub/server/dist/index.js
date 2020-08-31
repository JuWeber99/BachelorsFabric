"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const NetConnection_1 = require("./NetConnection");
const ChaincodeCaller_1 = require("./ChaincodeCaller");
const stripe_1 = require("stripe");
const body_parser_1 = __importDefault(require("body-parser"));
var stripe = new stripe_1.Stripe('sk_test_51HJpsyGLRl9OMbnVDfUbtvIbo9zZiy1af7oGJIqYmEMkb5fEE1PDFu3o1RMTHYJrGeNZHIObb6TOkDeDQWkFzm3T00OxXXxlVu', {
    apiVersion: "2020-03-02",
});
const app = express_1.default();
process.title = "poc-server";
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.get("/api/changeCustomerAddress", async (req, res) => {
    try {
        const network = await NetConnection_1.populateNetworkConnection();
        const caller = new ChaincodeCaller_1.ChainCodeCaller(network);
        await caller.changeCustomerAddressTest();
        res.status(200).send("Changed Address!");
        caller.disconnect();
    }
    catch (apiError) {
        res.status(400).send(apiError);
    }
});
app.get("/api/changeCustomerAddress/:accountId/:name/:forename", async (req, res) => {
    try {
        const network = await NetConnection_1.populateNetworkConnection();
        const caller = new ChaincodeCaller_1.ChainCodeCaller(network);
        await caller.changeCustomerAddressFor(req.params.accountId, req.params.name, req.params.forename);
        res.status(200).send("Changed Address!");
        caller.disconnect();
    }
    catch (apiError) {
        res.status(400).send(apiError);
    }
});
app.get("/api/createTestContractForInitialUser", async (req, res) => {
    try {
        const network = await NetConnection_1.populateNetworkConnection();
        const caller = new ChaincodeCaller_1.ChainCodeCaller(network);
        await caller.createSubscriptionContractForCustomerSim("5d60f057f5294daa7aee33183d3252d1fa78a64da3aee5d8dbdebcbc24c3b809", "310120265624299");
        res.status(200).send("PoC contract created!");
        caller.disconnect();
    }
    catch (apiError) {
        res.status(400).send(apiError);
    }
});
app.get('/api/createTestAccount', async (req, res) => {
    try {
        const network = await NetConnection_1.populateNetworkConnection();
        const caller = new ChaincodeCaller_1.ChainCodeCaller(network);
        await caller.createCustomerTestAccount();
        res.status(200).send("Test Account created");
        caller.disconnect();
    }
    catch (apiError) {
        res.status(400).send(apiError);
    }
});
app.get('/api/ct2', async (req, res) => {
    try {
        const network = await NetConnection_1.populateNetworkConnection();
        const caller = new ChaincodeCaller_1.ChainCodeCaller(network);
        await caller.createCustomerTestAccountTwo();
        res.status(200).send("Test Account created");
        caller.disconnect();
    }
    catch (apiError) {
        res.status(400).send(apiError);
    }
});
app.get('/api/readCustomerAccount/:accountId', async (req, res) => {
    try {
        const network = await NetConnection_1.populateNetworkConnection();
        const caller = new ChaincodeCaller_1.ChainCodeCaller(network);
        const result = await caller.readCustomerAccount(req.params.accountId);
        res.status(200).json(result);
        caller.disconnect();
    }
    catch (apiError) {
        res.status(400).send(apiError);
    }
});
app.get('/api/readInitialLedger', async (req, res) => {
    try {
        const network = await NetConnection_1.populateNetworkConnection();
        const caller = new ChaincodeCaller_1.ChainCodeCaller(network);
        const result = await caller.readInitialLedger();
        res.status(200).json(result);
        caller.disconnect();
    }
    catch (apiError) {
        res.status(400).send(apiError);
    }
});
app.get('/api/findPersonalDetailIndex/:accountId/:name/:forename', async (req, res) => {
    try {
        const network = await NetConnection_1.populateNetworkConnection();
        const caller = new ChaincodeCaller_1.ChainCodeCaller(network);
        const result = await caller.findPersonalDetailIndex(req.params.accountId, req.params.name, req.params.forename);
        res.status(200).json(result);
        caller.disconnect();
    }
    catch (apiError) {
        res.status(400).send(apiError);
    }
});
app.get("/", (req, res) => {
    res.send("Hello");
});
app.post('/sub', async (req, res) => {
    const { email, payment_method } = req.body;
    let client_secret;
    try {
        const customer = await stripe.customers.create({
            payment_method: payment_method,
            email: email,
            invoice_settings: {
                default_payment_method: payment_method,
            },
        });
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ plan: 'price_1HJpzkGLRl9OMbnVAKim8Kbz' }],
            expand: ['latest_invoice.payment_intent']
        });
        console.log(subscription);
        const status = subscription['latest_invoice']['payment_intent']['status'];
        client_secret = subscription['latest_invoice']['payment_intent']['client_secret'];
        res.json({ 'client_secret': client_secret, 'status': status });
    }
    catch (err) {
        console.log(err);
        res.json({
            error: {
                message: err.message,
                statusCode: err.statusCode
            }
        });
    }
});
app.listen(3031);
//# sourceMappingURL=index.js.map