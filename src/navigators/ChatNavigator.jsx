import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import MainChat from "../screens/MainChat";
import ProfileSearchNavigator from "./ProfileSearchNavigator";
import ChatScreen from "../screens/ChatScreen";
import FriendRequests from "../screens/FriendRequests";

const Stack = createStackNavigator();

const ChatNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
      }}
      initialRouteName="MainChat"
    >
      <Stack.Screen name="MainChat" component={MainChat} />
      <Stack.Screen name="ProfileSearchNavigator" component={ProfileSearchNavigator} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="FriendRequests" component={FriendRequests} />
    </Stack.Navigator>
  );
};

export default ChatNavigator;