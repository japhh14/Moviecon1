import { configureStore } from "@reduxjs/toolkit";
import firebaseSlice from "./slices/firebaseSlice";
import userSlice from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    firebase: firebaseSlice,
    user:userSlice
  },
});