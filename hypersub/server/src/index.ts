import express from "express";
import cors from "cors"
import 'dotenv/config';

const app = express();

app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.listen( 3031, () => {
    console.log("server started on port"+ 3031 +"!")
})