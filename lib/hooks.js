import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { auth, firestore } from "../lib/firebase";
import { collection, addDoc, doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      console.log(user);
      unsubscribe = onSnapshot(doc(firestore, "users", user.uid), (doc) => {
        console.log("username checking...");
        console.log(doc.data());
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}
