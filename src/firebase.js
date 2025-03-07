import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, get, push } from "firebase/database"; // Import database functions

const firebaseConfig = {
    apiKey: "AIzaSyDxBaSlOPsLLlGWCliDySMgS5TexdkiGyU",
    authDomain: "health-9fa08.firebaseapp.com",
    databaseURL: "https://health-9fa08-default-rtdb.firebaseio.com/",
    projectId: "health-9fa08",
    storageBucket: "health-9fa08.appspot.com",
    messagingSenderId: "417692012552",
    appId: "1:417692012552:web:33a8aa58ac72afa11701bd",
    measurementId: "G-CQ2SWTDR1C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Export instances and required database functions
export { app, auth, database, ref, set, get, push };
