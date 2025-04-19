import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: {
      uid: "",
      displayName: "",
      email: "",
      photoUrl: "",
      username: "",
    },
    favorites: [],
    watchlist: [],
    friends: [],
    friendRequests: [],
    sentFriendRequests: [],
  },
  reducers: {
    loadProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    clearStates: (state) => {
      state.profile = {
        uid: "",
        displayName: "",
        email: "",
        photoUrl: "",
        username: "",
      };
      state.favorites = [];
      state.watchlist = [];
      state.friends = [];
      state.friendRequests = [];
      state.sentFriendRequests = [];
    },
  },
});

export const { loadProfile, updateProfile, clearStates } = userSlice.actions;
export const selectStateUser = (state) => state.user;

export default userSlice.reducer;