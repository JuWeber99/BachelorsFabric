import express from "express";
import cors from "cors"
import 'dotenv/config';
import {Network} from "fabric-network";
import {populateNetworkConnection} from "./NetConnection";

const app = express();

app.use(cors())


app.get("/testUpdate", (req, res) => {
    // let readRes3 = await .submitTransaction('cafca', 'guhidasfg238r766grzseugc97dsaftg67sadfadsf23', "Weber", "Julian",
    //     "11111", "UpdateCity", "UpdateStreet", "2", testAddress.country);
})

app.listen(3031, () => {
    console.log("server started on port" + 3031 + "!")
    let connection = Promise.resolve<Network>(populateNetworkConnection())
    console.log("1 : " + connection)
    console.log("2 : "+ connection.then((result) => JSON.stringify(result)))
})