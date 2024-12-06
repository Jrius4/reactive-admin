const { uploadProcessData } = require("./lib/firebase");
const { errorHandler } = require("./lib/helpers");

async function handler(req, method) {
    try {
        if (method === "GET") {
            const path = req.path;
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
            const { } = req;

            if (path === "/process") {
                const data = req.body;
                await uploadProcessData();
                return "Process data uploaded";
            }
        }

    } catch (error) {
        errorHandler(error, "controller-hander");
    }
}

module.exports = {
    handler
}

