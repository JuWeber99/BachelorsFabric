import express from "express";
import cors from "cors"
import {populateNetworkConnection} from "./NetConnection";
import {ChainCodeCaller} from "./ChaincodeCaller";

const app = express();

app.use(cors())


app.get("/test", async (req, res) => {
    const netConnection = await populateNetworkConnection();
    const caller = new ChainCodeCaller(netConnection);
    const initialLedger = await caller.readInitialLedger();

    if (!initialLedger || initialLedger === null) {
        res.send("FAILED TO RED INITIAL LEDGER")
        return
    }
    res.send(initialLedger)
    netConnection.getGateway().disconnect();
})

app.get("/", (req, res) => {
    res.send("HELLO WORLD")
})

app.listen(3031, async (req, response) => {
    console.log("server started on port" + 3031 + "!")
})