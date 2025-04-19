import React, { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity, 
  View,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useDispatch } from "react-redux";
import { firebaseSignUp } from "../features/slices/firebaseSlice";

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();

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

  const handleSignup = () => {
    try {
      dispatch(firebaseSignUp({ email, password, username }));
    } catch (err) {
      console.log("Error:", err.code);
    }
  };

  return (
    <KeyboardAvoidingView
      // TODO:
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      // keyboardVerticalOffset={Platform.select({ ios: 0, android: 100 })}
      style={{
        backgroundColor: "black",
        padding: 20,
        marginTop: StatusBar.currentHeight,
        flex: 1,
        height: "100%",
      }}
    >
      <View style={{ gap: 5 }}>
        <Text style={{ color: "white", fontSize: 25, fontFamily: "HeroBd" }}>
          SIGNUP
        </Text>
        <Text style={{ color: "#999999", fontFamily: "HeroRg", fontSize: 17 }}>
          Please sign up to create a new account
        </Text>
      </View>
      <View style={{ marginVertical: 35, gap: 20 }}>
        <View style={{ gap: 10 }}>
          <Text style={{ color: "#999999", fontFamily: "HeroRg" }}>
            Username
          </Text>
          <TextInput
            style={{
              backgroundColor: "#1A1A1A",
              height: 50,
              paddingLeft: 15,
              borderRadius: 5,
              fontSize: 15,
              color: "white",
              fontFamily: "HeroRg",
            }}
            placeholder="John Doe"
            placeholderTextColor={"#999999"}
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
        </View>
        <View style={{ gap: 10 }}>
          <Text style={{ color: "#999999", fontFamily: "HeroRg" }}>
            Email ID
          </Text>
          <TextInput
            style={{
              backgroundColor: "#1A1A1A",
              height: 50,
              paddingLeft: 15,
              borderRadius: 5,
              fontSize: 15,
              color: "white",
              fontFamily: "HeroRg",
            }}
            placeholder="johndoe@gmail.com"
            placeholderTextColor={"#999999"}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={{ gap: 10 }}>
          <Text style={{ color: "#999999", fontFamily: "HeroRg" }}>
            Password
          </Text>
          <TextInput
            style={{
              backgroundColor: "#1A1A1A",
              height: 50,
              paddingLeft: 15,
              borderRadius: 5,
              fontSize: 15,
              color: "white",
              fontFamily: "HeroRg",
            }}
            placeholder="*******"
            placeholderTextColor={"#999999"}
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>
        <View style={{ gap: 10 }}>
          <Text style={{ color: "#999999", fontFamily: "HeroRg" }}>
            Confirm Password
          </Text>
          <TextInput
            style={{
              backgroundColor: "#1A1A1A",
              height: 50,
              paddingLeft: 15,
              borderRadius: 5,
              fontSize: 15,
              color: "white",
              fontFamily: "HeroRg",
            }}
            placeholder="*******"
            placeholderTextColor={"#999999"}
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={handleSignup}
        style={{
          backgroundColor: "#d24dff",
          padding: 10,
          alignItems: "center",
          borderRadius: 7,
          fontFamily: "HeroBd",
        }}
      >
        <Text style={{ color: "white", fontSize: 25, fontWeight: "600" }}>
          SIGNUP
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 15,
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 15, fontFamily: "HeroRg" }}>
          Already have an account?{" "}
        </Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text
            style={{ color: "#d24dff", fontSize: 17, fontFamily: "HeroBd" }}
          >
            Login!
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Signup;
