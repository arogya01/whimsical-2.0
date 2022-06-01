// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCVxmV7g0NIOY6lLYk6LI3Y_-37cPoenSc",
  authDomain: "nextjs-project-66469.firebaseapp.com",
  projectId: "nextjs-project-66469",
  storageBucket: "nextjs-project-66469.appspot.com",
  messagingSenderId: "518021507194",
  appId: "1:518021507194:web:ea3921af9f468f504f73c3",
  measurementId: "G-2HHGYQLQX2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
