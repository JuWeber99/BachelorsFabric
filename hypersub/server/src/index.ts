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
        const result = await caller.readCustomerAccount(req.params.accountId);
        res.status(200).json({response: result.toString()})
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
        res.status(200).json({response: result.toString()})
        caller.disconnect();
    } catch (apiError) {
        res.status(400).send(apiError)
    }
})


// app.get("/api/test", async (req, res) => {
//     // const netConnection = await populateNetworkConnection();
//     // const caller = new ChainCodeCaller(netConnection);
//     // const initialLedger = await caller.readInitialLedger();
//     console.log("populate connection ...")
//     const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
//     const walletPath = path.join(process.cwd(), '..', 'wallet');
//     const wallet = await Wallets.newFileSystemWallet(walletPath);
//
//     console.log(`Wallet path: ${walletPath}`);
//     const identity = await wallet.get('testUser');
//
//     if (!identity) {
//         console.log('An identity for the user "testUser" does not exist in the wallet');
//         console.log('Run the enrollRegisterUser.ts application before retrying');
//         return;
//     }
//     const gateway = new Gateway();
//     await gateway.connect(ccp, {wallet, identity: 'testUser', discovery: {enabled: true, asLocalhost: true}});
//     const network = await gateway.getNetwork('channel1');
//     const contract = network.getContract("customeraccountcc")
//     let result = contract.submitTransaction("createCustomerTestAccount")
//     res.send("sending")
//     // if (!initialLedger || initialLedger === null) {
//     //     res.send("FAILED TO RED INITIAL LEDGER")
//     //     return
//     // }
//     // res.send(initialLedger)
//     // netConnection.getGateway().disconnect();
//     if (result) {
//         res.send("created")
//     }
// })


app.listen(3031);