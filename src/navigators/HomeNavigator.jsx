import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import ChatNavigator from "./ChatNavigator";
import SearchNavigator from "./SearchNavigator";
import MovieNavigator from "./MovieNavigator";
import ProfileNavigator from "./ProfileNavigator";

const Tab = createBottomTabNavigator();

const HomeNavigator = () => {
  console.log("HomeNavigator rendered"); // Debug log
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === "MovieNavigator") {
            iconName = focused ? "film-sharp" : "film-outline";
          } else if (route.name === "ProfileNavigator") {
            iconName = focused ? "person-circle-sharp" : "person-circle-outline";
          } else if (route.name === "ChatNavigator") {
            iconName = focused ? "chatbox-sharp" : "chatbox-outline";
          } else if (route.name === "SearchNavigator") {
            iconName = focused ? "search-sharp" : "search-outline";
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: "#d24dff",
        tabBarStyle: {
          backgroundColor: "black",
          paddingBottom: 5,
        },
      })}
      initialRouteName="MovieNavigator"
    >
      {[
        { name: "MovieNavigator", component: MovieNavigator, label: "HOME" },
        { name: "ChatNavigator", component: ChatNavigator, label: "CHAT" },
        { name: "SearchNavigator", component: SearchNavigator, label: "SEARCH" },
        { name: "ProfileNavigator", component: ProfileNavigator, label: "PROFILE" },
      ].map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{ tabBarLabel: screen.label }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default HomeNavigator;