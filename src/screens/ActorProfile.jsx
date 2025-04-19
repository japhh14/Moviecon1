import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import moment from 'moment';
import { useFonts } from 'expo-font';
import * as SplashScreen from "expo-splash-screen";

const ActorProfile = ({route, navigation}) => {
  const id = route.params['id'];

  const [actorData, setActorData] = useState(null);

  const getActorProfile = async id => {
    try {
      const url = `https://api.themoviedb.org/3/person/${id}?api_key=fc6b0f8734f6d710fed11de93fc496cc&append_to_response=combined_credits`;
      const response = await fetch(url);
      const data = await response.json();
      setActorData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getActorProfile(id);
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
    <>
      {actorData && (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: `https://image.tmdb.org/t/p/original${actorData.profile_path}`,
                }}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.nameText}>{actorData.name}</Text>
              <Text style={styles.knownForText}>
                Known for: {actorData.known_for_department}
              </Text>
              <Text style={styles.knownForText}>
                DOB: {moment(actorData.birthday).format('Do MMMM, YYYY')},{' '}
                {actorData.place_of_birth}
              </Text>
              <Text style={styles.knownForText}>
                Age: {moment().diff(actorData.birthday, 'years', false)}
              </Text>
            </View>
          </View>
          <Text style={styles.knwonForText} >Known For</Text>
          <View style={styles.movieContainer}>
            <FlatList
            showsVerticalScrollIndicator={false}
              style={{marginBottom: 220}}
              data={actorData.combined_credits.cast.filter(el=>el.poster_path!==null)}
              numColumns={3}
              renderItem={({item}) => (
                <TouchableOpacity style={styles.posterContainer} onPress={()=>navigation.push('MovieDetails',{movie:item})}>
                  <Image
                    style={styles.poster}
                    source={{
                      uri: `https://image.tmdb.org/t/p/original${item.poster_path}`,
                    }}
                  />
                </TouchableOpacity>
              )}
            />

            {/* // <Text>{movie.id}</Text> */}
          </View>
        </View>
      )}
    </>
  );
};

export default ActorProfile;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    height: '100%',
    width: '100%',
  },
  headerContainer: {
    height: 170,
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  profileImage: {
    height: '100%',
    width: '100%',
  },
  profileImageContainer: {
    height: '100%',
    width: 120,
  },
  infoContainer: {
    width: '70%',
    paddingRight: 10,
  },
  nameText: {
    fontFamily: 'Rubik-Regular',
    color: 'black',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
  },
  knownForText: {
    fontFamily: 'Rubik-Light',
    fontSize: 15,
    color: 'black',
  },
  movieContainer: {
    height: '100%',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // width:'50'
  },
  posterContainer: {
    height: 190,
    width: 120,
    margin: 2,
  },
  poster: {
    height: '100%',
    width: '100%',
  },
  knwonForText:{
    fontFamily:'Rubik-Regular',
    marginVertical:10,
    fontSize:20,
    color:'black'
  }
});
