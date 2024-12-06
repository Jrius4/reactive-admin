const { errorHandler } = require("../controller/lib/helpers.js");
const { admin } = require("./../controller/lib/firebase.js");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log(token);
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        errorHandler(error, 'AuthMiddleware-Unauthorized');
        res.status(401).send("Unauthorized");
    }
}

module.exports = authMiddleware;