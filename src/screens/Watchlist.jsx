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
import { selectStateUser, updateWatchlist, removeFromWatchlist } from "../features/slices/userSlice";
import MovieCard from "../components/MovieCard";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore_db } from "../../firebase";

SplashScreen.preventAutoHideAsync();

const Watchlist = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectStateUser);
  const { username, watchlist } = user.profile || { watchlist: user.watchlist };
  const [localWatchlist, setLocalWatchlist] = useState(watchlist || []);

  const [fontsLoaded] = useFonts({
    HeroLg: require("../assets/fonts/Hero-Light.ttf"),
    HeroRg: require("../assets/fonts/Hero-Regular.ttf"),
    HeroBd: require("../assets/fonts/Hero-Bold.ttf"),
  });

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!username) return;
      const userDocRef = doc(firestore_db, "user", username);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const fetchedWatchlist = data.watchlist || [];
        setLocalWatchlist(fetchedWatchlist);
        dispatch(updateWatchlist(fetchedWatchlist));
      }
    };
    fetchWatchlist();
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [username, dispatch, fontsLoaded]);

  const handleRemoveWatchlist = async (movieId) => {
    const updatedWatchlist = localWatchlist.filter((id) => id !== movieId);
    setLocalWatchlist(updatedWatchlist);
    dispatch(removeFromWatchlist(movieId));
    const userDocRef = doc(firestore_db, "user", username);
    await setDoc(userDocRef, { watchlist: updatedWatchlist }, { merge: true });
    console.log("Watchlist updated in Firestore for:", username);
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
        WATCHLIST
      </Text>
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 50 }}
          data={localWatchlist}
          renderItem={({ item }) => (
            <MovieCard
              id={item}
              navigation={navigation}
              onRemove={() => handleRemoveWatchlist(item)}
            />
          )}
          keyExtractor={(item) => item}
          ListEmptyComponent={<Text style={{ color: "#aaa" }}>No watchlist items added.</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

export default Watchlist;

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