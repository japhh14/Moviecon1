import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { FlatList } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const SimilarMovies = ({ id, navigation }) => {
  const [data, setData] = useState(null);

  const getSimilarMovies = async (id) => {
    try {
      const url = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=fc6b0f8734f6d710fed11de93fc496cc`;
      const response = await fetch(url);
      const movieData = await response.json();
      setData(movieData.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSimilarMovies(id);
  }, [id]);

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

  return (
    <View>
      {data ? (
        <FlatList
          horizontal={true}
          data={data}
          renderItem={({ item }) => (
            <SimilarMovieCard item={item} navigation={navigation} />
          )}
        />
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};

const SimilarMovieCard = ({ item, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.push("MovieDetails", { id: item.id })}
    >
      <Image
        style={styles.poster}
        source={{
          uri: `https://image.tmdb.org/t/p/original${item.poster_path}`,
        }}
      />
    </TouchableOpacity>
  );
};

export default SimilarMovies;

const styles = StyleSheet.create({
  poster: {
    width: 130,
    height: 200,
  },
  cardContainer: {
    marginRight: 10,
  },
});
