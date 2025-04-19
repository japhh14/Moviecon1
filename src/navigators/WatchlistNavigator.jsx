import React from "react";

import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import Favorite from "../screens/Favorite";
import MovieDetails from "../screens/MovieDetails";
import Watchlist from "../screens/Watchlist";

const Stack = createStackNavigator();

const WatchlistNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: false,
      }}
      initialRouteName="Watchlist"
    >
      <Stack.Screen name="Watchlist" component={Watchlist} />
      <Stack.Screen name="MovieDetails" component={MovieDetails} />
    </Stack.Navigator>
  );
};

export default WatchlistNavigator;
