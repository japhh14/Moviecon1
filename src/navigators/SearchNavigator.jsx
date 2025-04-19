import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import SearchMovies from "../screens/SearchMovies";
import MovieDetails from "../screens/MovieDetails";

const Stack = createStackNavigator();

const SearchNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
      }}
      initialRouteName="SearchMovies"
    >
      <Stack.Screen component={SearchMovies} name="SearchMovies" />
      <Stack.Screen component={MovieDetails} name="MovieDetails" />
    </Stack.Navigator>
  );
};

export default SearchNavigator;