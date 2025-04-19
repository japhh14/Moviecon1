import React from "react";

import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import Favorite from "../screens/Favorite";
import MovieDetails from "../screens/MovieDetails";

const Stack = createStackNavigator();

const FavoriteNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: false,
      }}
      initialRouteName="Favorite"
    >
      <Stack.Screen name="Favorite" component={Favorite} />
      <Stack.Screen name="MovieDetails" component={MovieDetails} />
    </Stack.Navigator>
  );
};

export default FavoriteNavigator;
