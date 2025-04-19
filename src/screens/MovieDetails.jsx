import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import moment from "moment";
import SimilarMovies from "../components/SimilarMovies";
import Cast from "../components/Cast";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { firestore_db } from "../../firebase";

SplashScreen.preventAutoHideAsync();

const MovieDetails = ({ navigation, route }) => {
  const movieId = route.params["id"];
  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);

  const getMovie = async (id) => {
    try {
      const url = `https://api.themoviedb.org/3/movie/${id}?api_key=fc6b0f8734f6d710fed11de93fc496cc`;
      const response = await fetch(url);
      const movieData = await response.json();
      setData(movieData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMovie(movieId);
  }, [movieId]);

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
    data && (
      <SafeAreaView
        style={{
          height: "100%",
          marginTop: StatusBar.currentHeight,
          backgroundColor: "black",
          position: "relative",
        }}
      >
        <ScrollView style={{ flex: 1 }} scrollEnabled={!visible}>
          <View style={{ height: 370 }}>
            <ImageBackground
              style={{ width: "100%", height: 221, resizeMode: "contain" }}
              source={{
                uri: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: "rgba(0,0,0,0.4)",
                }}
              />
            </ImageBackground>
            <View
              style={{
                position: "absolute",
                top: 160,
                left: 10,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  height: 200,
                  width: 130,
                  borderColor: "#808080",
                  borderWidth: 0.2,
                }}
              >
                <Image
                  style={{ height: "100%", width: "100%" }}
                  source={{
                    uri: `https://image.tmdb.org/t/p/original${data.poster_path}`,
                  }}
                />
              </View>
              <View style={{ width: "100%" }}>
                <Text
                  style={{
                    marginTop: 70,
                    marginLeft: 10,
                    fontFamily: "HeroRg",
                    fontSize: 25,
                    width: "45%",
                    color: "white",
                  }}
                >
                  {data.title}
                </Text>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 17,
                    fontFamily: "HeroRg",
                    color: "#909090",
                  }}
                >
                  {moment(data.release_date).format("Do MMMM YYYY")}
                </Text>
                <TouchableOpacity
                  style={{
                    margin: 10,
                    flexDirection: "row",
                    backgroundColor: "#d24dff",
                    alignSelf: "flex-start",
                    padding: 5,
                    borderRadius: 10,
                    alignItems: "center",
                    gap: 5,
                  }}
                  onPress={() => setVisible(true)}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "HeroRg",
                      fontSize: 17,
                    }}
                  >
                    SHARE
                  </Text>
                  <Feather name="share-2" size={17} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ padding: 10, gap: 10 }}>
            <View style={{ gap: 10 }}>
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                  fontFamily: "HeroBd",
                }}
              >
                Genres
              </Text>
              <View style={{ flexDirection: "row", gap: 15, flexWrap: "wrap" }}>
                {data.genres.map((genre) => (
                  <View
                    key={genre.id}
                    style={{
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 20,
                      borderColor: "#808080",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        color: "white",
                        fontFamily: "HeroRg",
                      }}
                    >
                      {genre.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                  fontFamily: "HeroBd",
                }}
              >
                Rating: {data.vote_average.toFixed(2)}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                  fontFamily: "HeroBd",
                }}
              >
                Overview
              </Text>
              <Text
                style={{
                  fontFamily: "HeroRg",
                  fontSize: 17,
                  color: "#909090",
                }}
              >
                {data.overview}
              </Text>
            </View>
            <View style={{ gap: 7 }}>
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                  fontFamily: "HeroBd",
                }}
              >
                Cast
              </Text>
              <Cast id={movieId} navigation={navigation} />
            </View>
            <View style={{ marginBottom: 40, gap: 7 }}>
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                  fontFamily: "HeroBd",
                }}
              >
                Similar
              </Text>
              <SimilarMovies id={movieId} navigation={navigation} />
            </View>
          </View>
        </ScrollView>
        {visible && (
          <View
            style={{
              position: "absolute",
              backgroundColor: "#202020",
              width: "90%",
              height: "90%",
              margin: 20,
              borderRadius: 10,
              padding: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 5,
              }}
            >
              <Text
                style={{ color: "white", fontFamily: "HeroBd", fontSize: 30 }}
              >
                SHARE
              </Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Entypo name="circle-with-cross" size={30} color="#d24dff" />
              </TouchableOpacity>
            </View>
            {/* Additional share options can go here */}
          </View>
        )}
      </SafeAreaView>
    )
  );
};

export default MovieDetails;

const styles = StyleSheet.create({
  // Styles can be kept as needed.
});
