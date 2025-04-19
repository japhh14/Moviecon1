import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { app, firestore_db } from "../../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // Ensure uuid is installed

export const firebaseSignin = createAsyncThunk(
  "signin",
  async ({ email, password }) => {
    try {
      const response = await signInWithEmailAndPassword(
        getAuth(app),
        email,
        password
      );
      const user = response.user;
      const username = user.displayName || "UnknownUser";
      const userDocRef = doc(firestore_db, "user", username);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: username,
          email: user.email || "",
          photoUrl: user.photoUrl || "",
          favorites: [],
          watchlist: [],
          friends: [],
          friendRequests: [],
          sentFriendRequests: [],
        }, { merge: true });
      }
      return {
        uid: user.uid,
        displayName: username,
        email: user.email || "",
        photoUrl: user.photoUrl || "",
        username: username,
      };
    } catch (error) {
      throw error;
    }
  }
);

export const firebaseSignUp = createAsyncThunk(
  "signup",
  async ({ email, password, username: inputUsername }) => {
    try {
      const userDetails = await createUserWithEmailAndPassword(
        getAuth(app),
        email,
        password
      );
      const user = userDetails.user;
      let finalUsername = inputUsername || user.email.split("@")[0] || "User" + uuidv4().slice(0, 4);
      let uniqueUsername = finalUsername;
      let suffix = 1;
      while (true) {
        const userDocRef = doc(firestore_db, "user", uniqueUsername);
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) break;
        uniqueUsername = `${finalUsername}${suffix}`;
        suffix++;
      }

      await updateProfile(user, { displayName: uniqueUsername });
      const userDocRef = doc(firestore_db, "user", uniqueUsername);
      await setDoc(userDocRef, {
        uid: user.uid,
        displayName: uniqueUsername,
        email: user.email,
        photoUrl: user.photoUrl || "",
        username: uniqueUsername,
        favorites: [],
        watchlist: [],
        friends: [],
        friendRequests: [],
        sentFriendRequests: [],
      }, { merge: true });

      return {
        uid: user.uid,
        displayName: uniqueUsername,
        email: user.email,
        photoUrl: user.photoUrl,
        username: uniqueUsername,
      };
    } catch (error) {
      throw error;
    }
  }
);

const firebaseSlice = createSlice({
  name: "firebase",
  initialState: {
    isLoading: false,
    user: null,
    isError: false,
    error: null,
  },
  reducers: {
    clearStates: (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.isError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(firebaseSignin.pending, (state, action) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(firebaseSignin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.user = action.payload;
      console.log("Firebase signin user:", state.user);
    });
    builder.addCase(firebaseSignin.rejected, (state, action) => {
      state.error = action.error.code;
      state.isError = true;
      state.isLoading = false;
      console.log("Firebase signin error:", state.error);
    });
    builder.addCase(firebaseSignUp.pending, (state, action) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(firebaseSignUp.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.user = action.payload;
      console.log("Firebase signup user:", state.user);
    });
    builder.addCase(firebaseSignUp.rejected, (state, action) => {
      state.error = action.error.code;
      state.isError = true;
      state.isLoading = false;
      console.log("Firebase signup error:", state.error);
    });
  },
});

export const { clearStates } = firebaseSlice.actions;
export const selectStateFirebase = (state) => state.firebase;

export default firebaseSlice.reducer;