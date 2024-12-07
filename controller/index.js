const { uploadProcessData, admin, firestoreDB } = require("./lib/firebase");
const { errorHandler } = require("./lib/helpers");


async function handler(req, method) {
    try {
        if (method === "GET") {
            const path = req.path;
            console.log(path);
            if (path === "/") {
                return "Hello World";
            }
            else if (path === "/process") {
                const data = req.body;
                await uploadProcessData();
                return "Process data uploaded";
            }
            else {
                return "Not found";
            }
        }
        else if (method === "POST") {
            const path = req.path;
            console.log(path);

            const { } = req.body;

            if (path === "/api/test/process") {
                const data = req.body;
                await uploadProcessData();
                return "Process data uploaded";
            }
        }

    } catch (error) {
        errorHandler(error, "controller-hander");
    }
}

//  fcm notification
async function sendNotifications(params) {
    try {
        const { title, body, token, data } = params;

        console.log({ params });
        console.log({ title, body, token, data });


        if (!token || !title || !body) {
            throw new Error({ message: "Missing required fields" });
        }

        const message = {
            notification: { title, body },
            token: token,
            data: data || {}
        };

        const response = await admin.messaging().send(message);


        // const response = await admin.messaging().sendEachForMulticast(message);
        return response;
    } catch (error) {
        errorHandler(error, "sendNotifications");
        throw error;
    }
}

async function triggerNotifications(params) {
    try {
        const { title, body, data } = params;

        console.log({ params });
        console.log({ title, body, data, firestoreDB });

        const tokenSnapshot = await firestoreDB.collection("device_tokens").get();
        const tokens = tokenSnapshot.docs.map(doc => doc.data().token);

        console.log({ tokens });
        if (!title || !body) {
            throw new Error({ message: "Missing required fields" });
        }

        const message = {
            notification: { title, body },
            // tokens: tokens,
            data: data || {}
        };

        const response = await admin.messaging().sendAll([message])

        // const response = await admin.messaging().sendEachForMulticast(message);
        return response;
    } catch (error) {
        errorHandler(error, "sendNotifications");
        throw error;
    }
}

async function dispatchTopicNotification(params) {
    try {
        const { topic, data, title, body } = params;
        if (!topic) {
            throw new Error({ message: "Missing required fields" });
        }

        const message = {
            notification: { title, body },
            topic: topic,
            data: data || {}
        };

        const response = await admin.messaging().send(message);
        return response;
    } catch (error) {
        errorHandler(error, "dispatchTopic");
        throw error;
    }
}

module.exports = {
    handler,
    sendNotifications,
    triggerNotifications,
    dispatchTopicNotification
}

