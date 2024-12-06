require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const { handler } = require("./controller");

const { initializeFirebase } = require("./controller/lib/firebase.js");

initializeFirebase();


app.post("*", async (req, res) => {
    res.send(await handler(req, "POST"))
});
app.get("*", async (req, res) => {
    res.send(await handler(req, "GET"))
});
app.listen(PORT, (err) => {
    if (err) {
        console.log("Error in server setup");
    }
    console.log(`Server is running on port ${PORT}`);
});
