import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
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
import { firebaseSignin } from "../features/slices/firebaseSlice";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = () => {
    if (email.length === 0 || password.length === 0) {
      Alert.alert("Login", "All Fields are compulsory");
      return;
    }
    try {
      dispatch(firebaseSignin({ email: email, password: password }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView>
      <SafeAreaView
        style={{
          backgroundColor: "black",
          height: "100%",
          width: "100%",
          padding: 20,
          marginTop: StatusBar.currentHeight,
        }}
      >
        <View style={{ flexDirection: "row", gap: 2, alignSelf: "center" }}>
          <Text
            style={{ color: "#d24dff", fontSize: 50, fontFamily: "HeroBd" }}
          >
            MovieCon
          </Text>
        </View>
        <View style={{ gap: 5, marginTop: 30 }}>
          <Text style={{ color: "white", fontSize: 25, fontFamily: "HeroBd" }}>
            LOGIN
          </Text>
          <Text
            style={{ color: "#999999", fontFamily: "HeroRg", fontSize: 17 }}
          >
            Please Login to Continue
          </Text>
        </View>
        <View style={{ marginVertical: 35, gap: 20 }}>
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
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={{ alignSelf: "flex-end" }}>
            <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
              <Text style={{ color: "#999999", fontFamily: "HeroBd" }}>
                Forgot Password
              </Text>
            </Pressable>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            backgroundColor: "#d24dff",
            padding: 10,
            alignItems: "center",
            borderRadius: 7,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 25,
              fontWeight: "600",
              fontFamily: "HeroBd",
            }}
          >
            LOGIN
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            marginVertical: 25,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 15, fontFamily: "HeroRg" }}>
            Don't have an account?{" "}
          </Text>
          <Pressable onPress={() => navigation.navigate("Signup")}>
            <Text
              style={{ color: "#d24dff", fontSize: 15, fontFamily: "HeroBd" }}
            >
              Sign up!
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Login;
