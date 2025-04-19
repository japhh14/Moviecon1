import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { FontAwesome } from "@expo/vector-icons";
import MovieCard from "../components/MovieCard";

SplashScreen.preventAutoHideAsync();

const SearchMovies = ({ navigation }) => {
  const [movieName, setMovieName] = useState("");
  const [movieData, setMovieData] = useState(null);

  const handleSearch = async () => {
    let searchQuery = movieName.split(" ").join("+");
    getMovies(searchQuery);
  };

  const getMovies = async (query) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=fc6b0f8734f6d710fed11de93fc496cc`
      );
      const moviedata = await response.json();
      setMovieData(moviedata);
    } catch (error) {
      console.log(error);
    }
  };

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
    <SafeAreaView
      style={{
        marginTop: StatusBar.currentHeight,
        backgroundColor: "black",
        height: "100%",
        padding: 8,
      }}
    >
      <View style={{ gap: 10 }}>
        <Text
          style={{
            color: "white",
            fontSize: 35,
            fontFamily: "HeroBd",
          }}
        >
          SEARCH MOVIES
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <TextInput
            style={{
              backgroundColor: "#303030",
              fontSize: 17,
              padding: 7,
              borderRadius: 10,
              color: "white",
              fontFamily: "HeroRg",
              width: "90%",
            }}
            placeholder="Enter Movie Name"
            placeholderTextColor={"#808080"}
            value={movieName}
            onChangeText={(e) => setMovieName(e)}
          />
          <TouchableOpacity onPress={handleSearch}>
            <FontAwesome name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {movieName.length !== 0 && movieData ? (
        <FlatList
          style={{ marginBottom: 30 }}
          data={movieData.results}
          renderItem={({ item }) => (
            <MovieCard id={item.id} navigation={navigation} />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};

export default SearchMovies;