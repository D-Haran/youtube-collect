import { useState, useEffect, createContext, useContext } from "react";
import { createFirebaseApp, firebaseAuth } from "../firebase/clientApp";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, getIdToken } from "firebase/auth";
import axios from "axios";

export const UserContext = createContext();

export default function UserContextComp({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // Helpful, to update the UI accordingly.

  useEffect(() => {
    // Listen authenticated user
    const app = createFirebaseApp();
    const auth = getAuth(app);
    const unsubscriber = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          console.log("USER: ", user)
          // User is signed in.
          const { uid, displayName, email, photoURL } = user;
          // You could also look for the user doc in your Firestore (if you have one):
          // const userDoc = await firebase.firestore().doc(`users/${uid}`).get()
          setUser({ uid, displayName, email, photoURL });
          const jwt = require("jsonwebtoken");
          const JWT_SECRET = process.env.JWT_SECRET;
          console.log(JWT_SECRET)
          var token = await getIdToken(auth.currentUser, true);
          console.log(token)
          console.log("TOKEN: ", token)
          document.cookie = "accessToken="+token
        } else {
          setUser(null)
        };
      } catch (error) {
        // Most probably a connection error. Handle appropriately.
      } finally {
        setLoadingUser(false);
      }
    });

    // Unsubscribe auth listener on unmount
    return () => unsubscriber();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}

export async function signOutWithGoogle() {
  try {
    await firebaseAuth.signOut();
    document.cookie = "accessToken=nothing"
  } catch (error) {
    console.error('Error signing out with Google', error);
  }
}
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = signInWithPopup(firebaseAuth, provider);
  }catch (error) {
    console.error('Error signing in with Google', error);
  }
}

// Custom hook that shorthands the context!
export const useUser = () => useContext(UserContext);
