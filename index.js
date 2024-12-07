require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const { initializeFirebase } = require("./controller/lib/firebase.js");
initializeFirebase();



const { handler, triggerNotifications, dispatchTopicNotification } = require("./controller");


const authMiddleware = require("./middlewares/authMiddleware.js");
const roleMiddleware = require("./middlewares/roleMiddleware.js");

const { sendNotifications } = require("./controller/index.js");
const { loginUser, registerUser } = require("./controller/lib/auth.js");
const { errorHandler } = require("./controller/lib/helpers.js");

const cors = require("cors");
app.use(cors());


app.get("/api/public", async (req, res) => {
    res.json({ message: "Public endpoint accessible to everyone" });
});

app.post("/api/fct-token", async (req, res) => {
    // console.log(req.body);

    // res.json({ message: "send push notification", data: req.body });

    try {
        const response = await sendNotifications(req.body);
        res.json({ message: "send push notification", data: response });
    } catch (error) {
        errorHandler(error, "sendNotifications");
        res.status(500).json({ message: error.message });
    }
});

app.post("/api/fct-token-trigger", async (req, res) => {
    try {
        const response = await triggerNotifications(req.body);
        res.json({ message: "trigger push notification", data: response });
    } catch (error) {
        errorHandler(error, "triggerPushNotification");
        res.status(500).json({ message: error.message });
    }
})

// fct-token-by-topic

app.post("/api/fct-token-by-topic", async (req, res) => {
    try {
        const response = await dispatchTopicNotification(req.body);
        res.json({ message: "dispatch topic notification", data: response });
    } catch (error) {
        errorHandler(error, "dispatchTopicNotification");
        res.status(500).json({ message: error.message });
    }
});

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

app.post("/api/test/*", authMiddleware, roleMiddleware(["doctor", "patient"]), async (req, res) => {
    res.send({ data: await handler(req, "POST"), message: `Welcome ${req.user.role}, here is the admin dashboard` })
});


app.listen(PORT, (err) => {
    if (err) {
        console.log("Error in server setup");
    }
    console.log(`Server is running on port ${PORT}`);
});
