import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const Cast = ({ id, navigation }) => {
  const [data, setData] = useState(null);

  const getCast = async (id) => {
    try {
      const url = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=fc6b0f8734f6d710fed11de93fc496cc`;
      const response = await fetch(url);
      const castData = await response.json();
      setData(castData.cast.slice(0, 15));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCast(id);
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
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.container}
              onPress={() => navigation.push("ActorProfile", { id: item.id })}
            >
              <Image
                style={styles.image}
                source={{
                  uri: `https://image.tmdb.org/t/p/original${item.profile_path}`,
                }}
              />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.character}>{item.character}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};

export default Cast;

const styles = StyleSheet.create({
  image: {
    height: 170,
    width: "100%",
  },
  container: {
    marginRight: 7,
    width: 100,
  },
  name: {
    fontFamily: "HeroRg",
    color: "white",
    fontSize: 15,
  },
  character: {
    fontFamily: "HeroRg",
    color: "#909090",
  },
});
