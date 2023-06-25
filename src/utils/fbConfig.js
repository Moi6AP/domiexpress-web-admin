import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDavycM8lt82uXbTz19Wr1P5Q7Mm_wRIuI",
    authDomain: "domiexpress-co.firebaseapp.com",
    databaseURL: "https://domiexpress-co-default-rtdb.firebaseio.com",
    projectId: "domiexpress-co",
    storageBucket: "domiexpress-co.appspot.com",
    messagingSenderId: "169237907197",
    appId: "1:169237907197:web:4bdda95f3db4076e7ba094",
    measurementId: "G-LEK31188VX"
};

initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const dbRealtime = getDatabase();




