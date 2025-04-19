import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import RecommendScreen from "../screens/RecommendScreen";
import MovieDetails from "../screens/MovieDetails";
const Stack = createStackNavigator();

const RecommendationNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
      }}
      initialRouteName="Recommendation"
    >
      <Stack.Screen name="Recommendation" component={RecommendScreen} />
      <Stack.Screen name="MovieDetails" component={MovieDetails} />
    </Stack.Navigator>
  );
};

export default RecommendationNavigator;
