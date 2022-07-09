import "../styles/globals.css";
import GlobalSpinnerContextProvider from "../context/globalSpinnerContext";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { auth, firestore } from "../lib/firebase";
import { collection, addDoc, doc, onSnapshot } from "firebase/firestore";
import { useUserData } from "../lib/hooks";

function MyApp({ Component, pageProps }) {
  const { user, username } = useUserData();

  return (
    <AuthContext.Provider value={{ user, username }}>
      <GlobalSpinnerContextProvider>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </GlobalSpinnerContextProvider>
    </AuthContext.Provider>
  );
}

export default MyApp;
