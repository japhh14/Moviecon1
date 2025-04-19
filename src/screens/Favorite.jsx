import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectStateUser, updateFavorites, removeFromFavorites } from "../features/slices/userSlice";
import MovieCard from "../components/MovieCard";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore_db } from "../../firebase";

SplashScreen.preventAutoHideAsync();

const Favorite = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectStateUser);
  const { username, favorites } = user.profile || { favorites: user.favorites };
  const [localFavorites, setLocalFavorites] = useState(favorites || []);

  const [fontsLoaded] = useFonts({
    HeroLg: require("../assets/fonts/Hero-Light.ttf"),
    HeroRg: require("../assets/fonts/Hero-Regular.ttf"),
    HeroBd: require("../assets/fonts/Hero-Bold.ttf"),
  });

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!username) return;
      const userDocRef = doc(firestore_db, "user", username);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const fetchedFavorites = data.favorites || [];
        setLocalFavorites(fetchedFavorites);
        dispatch(updateFavorites(fetchedFavorites));
      }
    };
    fetchFavorites();
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [username, dispatch, fontsLoaded]);

  const handleRemoveFavorite = async (movieId) => {
    const updatedFavorites = localFavorites.filter((id) => id !== movieId);
    setLocalFavorites(updatedFavorites);
    dispatch(removeFromFavorites(movieId));
    const userDocRef = doc(firestore_db, "user", username);
    await setDoc(userDocRef, { favorites: updatedFavorites }, { merge: true });
    console.log("Favorite removed from Firestore for:", username);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: StatusBar.currentHeight,
        backgroundColor: "black",
        padding: 8,
      }}
    >
      <Text
        style={{
          color: "white",
          margin: 8,
          fontFamily: "HeroBd",
          fontSize: 30,
        }}
      >
        FAVORITE MOVIES
      </Text>
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 50 }}
          data={localFavorites}
          renderItem={({ item }) => (
            <MovieCard
              id={item}
              navigation={navigation}
              onRemove={() => handleRemoveFavorite(item)}
            />
          )}
          keyExtractor={(item) => item}
          ListEmptyComponent={<Text style={{ color: "#aaa" }}>No favorites added.</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

export default Favorite;

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontFamily: "Rubik-SemiBold",
    color: "#8f62bf",
    textAlign: "center",
  },
  titleContainer: {
    padding: 10,
  },
  imageContainer: {
    height: "100%",
    width: "28%",
  },
  image: {
    height: "100%",
    width: "100%",
  },
});