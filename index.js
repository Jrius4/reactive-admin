require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const { handler } = require("./controller");

const { initializeFirebase } = require("./controller/lib/firebase.js");

const authMiddleware = require("./middlewares/authMiddleware.js");
const roleMiddleware = require("./middlewares/roleMiddleware.js");

initializeFirebase();

app.get("/api/public", async (req, res) => {
    res.send("Public endpoint accessible to everyone");
});

const { loginUser, registerUser } = require("./controller/lib/auth.js");



app.post("/api/login", async (req, res) => {
    console.log(req.body);
    res.send(await loginUser(req.body.email, req.body.password));
});


app.post("/api/register", authMiddleware, async (req, res) => {
    res.send(await registerUser(req.body));
});


// protected endpoint for doctors and patients
app.get("/api/appointments", authMiddleware, roleMiddleware(["doctor", "patient"]), async (req, res) => {
    res.send({ data: await handler(req, "GET"), message: `Welcome ${req.user.role}, here are your appointments` })
});

app.post("/api/appointments", authMiddleware, roleMiddleware(["doctor", "patient"]), async (req, res) => {
    res.send({ data: await handler(req, "POST"), message: `Welcome ${req.user.role}, here are your appointments` })
});
app.get("/api/admin/dashboard", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    res.send({ data: await handler(req, "GET"), message: `Welcome ${req.user.role}, here is the admin dashboard` })
});

app.post("/api/test/*", authMiddleware, async (req, res) => {
    res.send({ data: await handler(req, "POST"), message: `Welcome ${req.user.role}, here is the admin dashboard` })
});


app.listen(PORT, (err) => {
    if (err) {
        console.log("Error in server setup");
    }
    console.log(`Server is running on port ${PORT}`);
});
