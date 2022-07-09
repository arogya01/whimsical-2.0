import { app, firestore } from "../lib/firebase";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fSignOut,
} from "firebase/auth";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { getDoc, doc, writeBatch } from "firebase/firestore";
import debounce from "lodash.debounce";
import { useGlobalSpinner } from "../context/globalSpinnerContext";
import Spinner from "../components/utility/Spinner";
import { useUserData } from "../lib/hooks";

// user can be in three diff states
// 1. user signed out, <SignInButton />
// 2. user signed in, but missing username <UsernameForm />
// 3. user signed in, has username <SignoutButton />

export default function EnterPage() {
  const { user, username } = useUserData();

  return (
    <main>
      {user ? (
        !username ? (
          <>
            <UserNameForm />
          </>
        ) : (
          <>
            <SignoutButton />
          </>
        )
      ) : (
        <div className="flex flex-row justify-center items-center mt-16">
          <SignInButton />
        </div>
      )}
    </main>
  );
}

function SignInButton() {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);

      console.log(errorCode, errorMessage, email);
    }
  };

  return (
    <button
      className="rounded-md mr-8 bg-white border-2 border-cyan-200 transition-all hover:translate-y-1 hover:bg-cyan-300 p-4 flex flex-row items-center"
      onClick={signInWithGoogle}
    >
      <Image src="/google.png" alt="google" width={24} height={24} />
      <span className="font-semibold ml-4">sign-in with Google</span>
    </button>
  );
}

const SignoutButton = async () => {
  const auth = getAuth(app);
  await fSignOut(auth);
};

function UserNameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGlobalSpinnerOn, setGlobalSpinner] = useGlobalSpinner();

  const { user, username } = useAuth();

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setGlobalSpinner(true);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setGlobalSpinner(false);
      setIsValid(false);
    }
  };

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const docsRef = doc(firestore, "usernames", `${username}`);
        const docSnap = await getDoc(docsRef);
        console.log("firestore read executed");

        if (docSnap.exists()) {
          console.log("Doc Data:", docSnap.data());
        } else {
          console.log("doc doesn't exist");
        }

        setGlobalSpinner(false);
        setLoading(false);
        setIsValid(!docSnap.exists());
      }
    }, 500),
    []
  );

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue, checkUsername]);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const userRef = await doc(firestore, "users", `${user.uid}`);
      const usernameRef = await doc(firestore, "usernames", formValue);

      const batch = writeBatch(firestore);
      batch.set(userRef, {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });
      batch.set(usernameRef, { uid: user.uid });

      await batch.commit();
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    !username && (
      <div className="flex flex-col p-4 items-center justify-center">
        <section className="mx-auto mt-16 border-2 border-black rounded-lg p-8">
          <h3 className="text-center font-semibold text-xl mb-4">
            Choose Username
          </h3>
          <form className="flex flex-col items-center m-4" onSubmit={onSubmit}>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="aroy"
              required
              value={formValue}
              onChange={onChange}
            />
            <UsernameMessage
              username={username}
              isValid={isValid}
              loading={loading}
            />
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-4 mb-8"
              disabled={!isValid}
            >
              Submit
            </button>

            <div className="flex flex-col">
              <h3>Debug State</h3>
              <div>
                Username: {formValue}
                <br />
                Loading: Loading...
                <br />
                Username Valid: {isValid.toString()}
              </div>
            </div>
          </form>
        </section>
      </div>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
