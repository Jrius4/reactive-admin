// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
const { errorHandler } = require("./helpers.js");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const admin = require("firebase-admin");
const ServiceAccount = require("./../../service-secret-key.json");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional



const {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID
} = process.env;



const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DATABASE_URL,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID,
}

let app;
let firestoreDB;
const initializeFirebase = () => {
    try {
        // Initialize Firebase
        app = initializeApp(firebaseConfig);
        admin.initializeApp({ credential: admin.credential.cert(ServiceAccount) });
        firestoreDB = getFirestore(app);
        return app;

    } catch (error) {
        errorHandler(error, "firebase-initializeFirebase");
    }
}

const uploadProcessData = async (data) => {
    const dataToUpload = {
        key1: "test",
        key2: 1231,
        key3: true,
        joinedAt: new Date(),
        createdAt: new Date().toISOString()
    }
    try {
        const docRef = doc(firestoreDB, "receipts", "some-unique-id");
        await setDoc(docRef, dataToUpload);
    } catch (error) {
        errorHandler(error, "firebase-uploadProcessData");
    }
}

const getFirebase = () => app;

module.exports = {
    getFirebase,
    initializeFirebase,
    firestoreDB,
    app,
    admin,
    uploadProcessData
}
