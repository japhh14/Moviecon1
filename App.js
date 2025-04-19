import "react-native-gesture-handler";
import AuthNavigator from "./src/navigators/AuthNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { app } from "./firebase";
import { Text } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Provider } from "react-redux";
import { store } from "./src/features/store";
import HomeNavigator from "./src/navigators/HomeNavigator";
import { useDispatch } from "react-redux";
import { loadProfile, clearStates } from "./src/features/slices/userSlice";
import * as SplashScreen from "expo-splash-screen";

// Debug import checks
console.log("Import check - useDispatch:", typeof useDispatch);
console.log("Import check - loadProfile:", typeof loadProfile);
console.log("Import check - store:", typeof store);

SplashScreen.preventAutoHideAsync();

let AppComponent = function App() {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed, currentUser:", currentUser ? currentUser.uid : "null");
      if (currentUser) {
        setUser(currentUser);
        const displayName = currentUser.displayName || "UnknownUser";
        const username = displayName; // Use displayName as username
        const profileData = {
          uid: currentUser.uid,
          displayName: displayName,
          email: currentUser.email || "",
          photoUrl: currentUser.photoUrl || "",
          username: username,
        };
        console.log("Dispatching loadProfile with:", profileData);
        dispatch(loadProfile(profileData));
        console.log("Redux state after dispatch:", store.getState().user);
      } else {
        setUser(null);
        dispatch(clearStates());
        console.log("Cleared Redux state:", store.getState().user);
      }
      setLoading(false);
      SplashScreen.hideAsync().catch(console.error);
    });
    return unsubscribe;
  }, [dispatch]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <NavigationContainer>
      {user ? <HomeNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const WrappedApp = () => (
  <Provider store={store}>
    <AppComponent />
  </Provider>
);

export default WrappedApp;