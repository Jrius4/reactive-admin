// const { initializeApp } = require('firebase/app');
const { app, admin, getFirebase } = require("./firebase")
const { getFirestore } = require("firebase-admin/firestore")
const {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} = require('firebase/auth');
const { errorHandler } = require("./helpers");

// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID
// };

// Initialize Firebase

const auth = getAuth(app);

// Authentication functions
const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        return { user: userCredential.user, token };
    } catch (error) {
        throw error;
    }
};

const registerUser = async (params) => {
    try {
        // create the user in firebase auth
        const { email, password, role, displayName } = params;
        const userRecord = await admin.auth().createUser({
            email, password
        });

        // set custom claims (role)
        await admin.auth().setCustomUserClaims(userRecord.uid, {
            role: role,
            displayName: displayName
        })

        const db = getFirestore();

        await db.collection('users').doc(userRecord.uid).set({
            email,
            role,
            displayName,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });





        // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // const token = await userCredential.user.getIdToken();
        return { message: "User created successfully", user: userRecord, uid: userRecord.uid };
    } catch (error) {
        throw error;
        errorHandler(error, "register-User")
    }
};

const logoutUser = () => signOut(auth);

const getCurrentUser = () => auth.currentUser;

module.exports = {
    auth,
    onAuthStateChanged,
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser
};