import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectStateUser, loadProfile } from "../features/slices/userSlice";
import { doc, setDoc } from "firebase/firestore"; // Changed from updateDoc to setDoc with merge
import { firestore_db } from "../../firebase";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const EditProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const userSelector = useSelector(selectStateUser);
  const [displayName, setDisplayName] = useState(userSelector.profile.displayName);
  const [username, setUsername] = useState(userSelector.profile.username);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    HeroLg: require("../assets/fonts/Hero-Light.ttf"),
    HeroRg: require("../assets/fonts/Hero-Regular.ttf"),
    HeroBd: require("../assets/fonts/Hero-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const handleSave = async () => {
    if (!displayName || !username) {
      Alert.alert("Error", "Display Name and Username are required.");
      return;
    }
    setLoading(true);
    try {
      const userDocRef = doc(firestore_db, "user", username); // Use username as document ID
      await setDoc(userDocRef, {
        displayName,
        username, // Update username field if changed
        email: userSelector.profile.email, // Preserve email
        photoUrl: userSelector.profile.photoUrl, // Preserve photoUrl
      }, { merge: true }); // Use setDoc with merge to create or update
      dispatch(loadProfile({
        uid: userSelector.profile.uid,
        displayName,
        email: userSelector.profile.email,
        photoUrl: userSelector.profile.photoUrl,
        username, // Update username in Redux
      }));
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        marginTop: StatusBar.currentHeight,
        flex: 1,
        backgroundColor: "black",
        padding: 15,
      }}
    >
      <Text
        style={{
          color: "white",
          fontFamily: "HeroBd",
          fontSize: 35,
          marginBottom: 20,
        }}
      >
        Edit Profile
      </Text>
      <View style={{ gap: 15 }}>
        <TextInput
          style={{
            backgroundColor: "#202020",
            color: "white",
            fontSize: 17,
            padding: 10,
            borderRadius: 10,
          }}
          placeholder="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
        />
        <TextInput
          style={{
            backgroundColor: "#202020",
            color: "white",
            fontSize: 17,
            padding: 10,
            borderRadius: 10,
          }}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#d24dff",
            padding: 10,
            borderRadius: 10,
            alignItems: "center",
          }}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={{ color: "black", fontFamily: "HeroBd", fontSize: 18 }}>
            {loading ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;