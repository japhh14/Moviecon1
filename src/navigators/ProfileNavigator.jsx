import React, { useEffect } from "react";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import Profile from "../screens/Profile";
import FavoriteNavigator from "./FavoriteNavigator";
import WatchlistNavigator from "./WatchlistNavigator";
import FriendSuggestions from "../screens/FriendSuggestions";
import EditProfile from "../screens/EditProfile";
import ProfileSearchNavigator from "./ProfileSearchNavigator"; // Ensure this is correct
import { useSelector } from "react-redux";
import { selectStateUser } from "../features/slices/userSlice";
import { doc, setDoc } from "firebase/firestore";
import { firestore_db } from "../../firebase";

const Stack = createStackNavigator();

const ProfileNavigator = () => {
  console.log("ProfileNavigator rendered"); // Debug log
  const user = useSelector(selectStateUser);
  const { username } = user.profile || {};

  useEffect(() => {
    const initializeUserDoc = async () => {
      if (!username) return;
      try {
        const userDocRef = doc(firestore_db, "user", username);
        const docSnap = await setDoc(userDocRef, {}, { merge: true }); // Ensure document exists
        console.log("User document initialized or updated for:", username);
      } catch (error) {
        console.error("Error initializing user document:", error);
      }
    };
    initializeUserDoc();
  }, [username]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: false,
      }}
      initialRouteName="Profile"
    >
      <Stack.Screen 
        name="Profile" 
        component={Profile} 
        options={{ title: "Profile" }} 
      />
      <Stack.Screen 
        name="FavoriteNavigator" 
        component={FavoriteNavigator} 
        options={{ title: "Favorites" }}
      />
      <Stack.Screen 
        name="WatchlistNavigator" 
        component={WatchlistNavigator} 
        options={{ title: "Watchlist" }}
      />
      <Stack.Screen 
        name="FriendSuggestions" 
        component={FriendSuggestions} 
        options={{ title: "Friend Suggestions" }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfile} 
        options={{ title: "Edit Profile" }}
      />
      <Stack.Screen 
        name="ProfileSearch" 
        component={ProfileSearchNavigator} 
        options={{ title: "Profile Search" }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;