import { Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";
import { Feather, AntDesign } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { firestore_db } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectStateUser, updateFavorites, updateWatchlist } from "../features/slices/userSlice";

SplashScreen.preventAutoHideAsync();

const MovieCard = ({ id, navigation }) => {
  const dispatch = useDispatch();
  const userAuth = getAuth().currentUser;
  const user = useSelector(selectStateUser);
  const [movie, setMovie] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const username = user.profile?.username; // Use username from Redux

  const getMovie = async (id) => {
    try {
      const url = `https://api.themoviedb.org/3/movie/${id}?api_key=fc6b0f8734f6d710fed11de93fc496cc`;
      const response = await fetch(url);
      const movieData = await response.json();
      setMovie(movieData);
    } catch (error) {
      console.log(error);
    }
  };

  const checkUserPreferences = async () => {
    if (!username || !userAuth) return;
    const userDocRef = doc(firestore_db, "user", username);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      setIsLiked(data.favorites?.includes(id) || false);
      setInWatchlist(data.watchlist?.includes(id) || false);
    }
  };

  const toggleFavorite = async () => {
    if (!username || !userAuth) return;
    const userDocRef = doc(firestore_db, "user", username);
    const operation = isLiked ? arrayRemove(id) : arrayUnion(id);
    await updateDoc(userDocRef, { favorites: operation });
    setIsLiked(!isLiked);
    dispatch(updateFavorites(isLiked ? user.favorites.filter((item) => item !== id) : [...user.favorites, id]));
    console.log("Favorite toggled for:", username);
  };

  const toggleWatchlist = async () => {
    if (!username || !userAuth) return;
    const userDocRef = doc(firestore_db, "user", username);
    const operation = inWatchlist ? arrayRemove(id) : arrayUnion(id);
    await updateDoc(userDocRef, { watchlist: operation });
    setInWatchlist(!inWatchlist);
    dispatch(updateWatchlist(inWatchlist ? user.watchlist.filter((item) => item !== id) : [...user.watchlist, id]));
    console.log("Watchlist toggled for:", username);
  };

  useEffect(() => {
    getMovie(id);
    checkUserPreferences();
  }, [id, username, userAuth]);

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

  if (!fontsLoaded || !movie) {
    return null;
  }

  return (
    <View>
      <TouchableOpacity
        style={{
          flex: 1,
          width: "100%",
          height: 180,
          backgroundColor: "#202020",
          flexDirection: "row",
          elevation: 6,
          shadowColor: "#171717",
          padding: 10,
          borderRadius: 10,
          marginVertical: 8,
        }}
        onPress={() => navigation.navigate("MovieDetails", { id: id })}
      >
        <View style={{ height: "100%", width: "28%" }}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
            }}
            style={{ height: "100%", width: "100%", borderRadius: 10 }}
          />
        </View>
        <View
          style={{
            width: "72%",
            paddingHorizontal: 10,
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontFamily: "HeroRg", color: "white", fontSize: 16 }}>
              {movie.title}
            </Text>
            <Text style={{ fontFamily: "HeroLg", color: "white" }}>
              {moment(movie.release_date).format("Do MMM YYYY")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <TouchableOpacity onPress={toggleFavorite}>
              <AntDesign
                name={isLiked ? "heart" : "hearto"}
                size={24}
                color={isLiked ? "red" : "white"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleWatchlist}>
              <AntDesign
                name={inWatchlist ? "pushpin" : "pushpino"}
                size={24}
                color={inWatchlist ? "#d24dff" : "white"}
              />
            </TouchableOpacity>
            <Feather name="thumbs-up" size={20} color="green" />
            <Text style={{ fontFamily: "HeroRg", color: "white", fontSize: 18 }}>
              {movie.vote_average.toFixed(2)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MovieCard;