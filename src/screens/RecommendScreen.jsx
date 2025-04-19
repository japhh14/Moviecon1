import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useSelector } from "react-redux";
import { selectStateUser } from "../features/slices/userSlice";
import { FlatList } from "react-native-gesture-handler";

const RecommendScreen = ({ navigation }) => {
  const userSelector = useSelector(selectStateUser);
  const [error, setError] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const getFavorites = () => {
    if (userSelector.favorites.length < 5) {
      setError(true);
      return;
    } else {
      setError(false);
    }
    return getRandomElements(userSelector.favorites, 5);
  };

  function getRandomElements(arr, count) {
    const shuffledArray = [...arr];
    let currentIndex = shuffledArray.length;
    let randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
        shuffledArray[randomIndex],
        shuffledArray[currentIndex],
      ];
    }
    return shuffledArray.slice(0, count);
  }

  const getData = async (id) => {
    try {
      const url = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=fc6b0f8734f6d710fed11de93fc496cc`;
      const response = await fetch(url);
      const moviedata = await response.json();
      if (moviedata.results) {
        return moviedata;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRecommendations = async () => {
    const RandomfavoriteArray = getFavorites();
    const favoritesArray = userSelector.favorites;
    if (favoritesArray.length >= 5) {
      let recommendationsArray = [];
      for (const movieId of RandomfavoriteArray) {
        const movieData = await getData(movieId);

        if (movieData && movieData.results) {
          movieData.results.forEach((recommendation) => {
            if (
              !recommendationsArray.some(
                (movie) =>
                  movie.id === recommendation.id &&
                  !favoritesArray.includes(recommendation.id)
              )
            ) {
              recommendationsArray.push(recommendation);
            }
          });
        }
        setRecommendations(recommendationsArray);
      }
    }
  };

  useEffect(() => {
    getRecommendations();
  }, []);

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
        flex: 1,
        backgroundColor: "black",
        padding: 8,
      }}
    >
      <View>
        <Text
          style={{
            fontFamily: "HeroBd",
            color: "white",
            fontSize: 35,
            marginBottom: 10,
          }}
        >
          MOVIES YOU MIGHT LIKE
        </Text>
      </View>
      <View>
        {error ? (
          <Text
            style={{ color: "#909090", fontSize: 20, fontFamily: "HeroRg" }}
          >
            *You should have atleast 5 movies in Favorites
          </Text>
        ) : (
          recommendations && (
            <View>
              <FlatList
                style={{ marginBottom: 95 }}
                numColumns={3}
                data={recommendations}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  if (item.poster_path) {
                    return (
                      <TouchableOpacity
                        style={{ height: 190, width: 120, margin: 2 }}
                        onPress={() =>
                          navigation.navigate("MovieDetails", { id: item.id })
                        }
                      >
                        <Image
                          style={{ height: "100%", width: "100%" }}
                          source={{
                            uri: `https://image.tmdb.org/t/p/original${item.poster_path}`,
                          }}
                        />
                      </TouchableOpacity>
                    );
                  }
                }}
              />
            </View>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default RecommendScreen;
