import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFriends,
  addToSentFriendRequests,
  removeFromFriendRequests,
  selectStateUser,
} from "../features/slices/userSlice";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import { firestore_db } from "../../firebase";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

const FriendRequests = () => {
  const userSelector = useSelector(selectStateUser);
  const [requestList, setRequestList] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Fetch user data by ID
  const getUser = async (id) => {
    const docRef = doc(firestore_db, "user", id);
    try {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        return { id, ...docSnapshot.data() };
      }
    } catch (error) {
      console.error("Error fetching document data:", error);
    }
  };

  // Fetch friend requests
  const getFriendRequests = async () => {
    setLoading(true);
    const requestArray = [...userSelector.friendRequests];
    const requestListData = await Promise.all(
      requestArray.map(async (id) => await getUser(id))
    );
    setRequestList(requestListData.filter((user) => user !== undefined));
    setLoading(false);
  };

  // Fetch suggested friends based on similarities (using interests)
  const getSuggestedFriends = async () => {
    const usersRef = collection(firestore_db, "user");
    const currentUserInterests = userSelector.profile.interests || [];
    const q = query(usersRef, where("interests", "array-contains-any", currentUserInterests));
    const querySnapshot = await getDocs(q);
    const suggestions = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => user.id !== userSelector.profile.uid && !userSelector.friends.includes(user.id));
    setSuggestedFriends(suggestions);
  };

  // Search users by username
  const handleSearch = async (queryStr) => {
    setSearchQuery(queryStr);
    if (queryStr.length > 0) {
      const usersRef = collection(firestore_db, "user");
      const q = query(usersRef, where("username", ">=", queryStr), where("username", "<=", queryStr + "\uf8ff"));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.id !== userSelector.profile.uid && !userSelector.friends.includes(user.id));
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    getFriendRequests();
    getSuggestedFriends();
  }, [userSelector.friendRequests, userSelector.profile]);

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

  const handleFriends = (id) => {
    console.log("already friends");
  };

  const handleRequestSent = (id) => {
    console.log("request already sent");
  };

  const handleAcceptRequest = async (id) => {
    try {
      const userDocRef = doc(firestore_db, "user", userSelector.profile.uid);
      const userDocRefOther = doc(firestore_db, "user", id);
      await updateDoc(userDocRefOther, {
        friends: arrayUnion(userSelector.profile.uid),
        sentFriendRequests: arrayRemove(userSelector.profile.uid),
      });
      await updateDoc(userDocRef, {
        friends: arrayUnion(id),
        friendRequests: arrayRemove(id),
      });
      dispatch(addToFriends(id));
      dispatch(removeFromFriendRequests(id));
    } catch (error) {
      console.error("Error accepting friend request:", error);
      throw error;
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      const userDocRef = doc(firestore_db, "user", userSelector.profile.uid);
      const userDocRefOther = doc(firestore_db, "user", id);
      await updateDoc(userDocRef, {
        friendRequests: arrayRemove(id),
      });
      await updateDoc(userDocRefOther, {
        sentFriendRequests: arrayRemove(userSelector.profile.uid),
      });
      dispatch(removeFromFriendRequests(id));
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      throw error;
    }
  };

  const handleSendRequest = async (id) => {
    try {
      const userDocRefOther = doc(firestore_db, "user", id);
      const userDocRef = doc(firestore_db, "user", userSelector.profile.uid);
      await updateDoc(userDocRefOther, {
        friendRequests: arrayUnion(userSelector.profile.uid),
      });
      await updateDoc(userDocRef, {
        sentFriendRequests: arrayUnion(id),
      });
      dispatch(addToSentFriendRequests(id));
    } catch (error) {
      console.error("Error sending friend request:", error);
      throw error;
    }
  };

  // Render profile card for suggestions and search results
  const renderProfileCard = ({ item }) => (
    <View style={styles.profileCard}>
      <Text style={styles.name}>{item.displayName} (@{item.username || "No username"})</Text>
      <Text style={styles.email}>{item.email}</Text>
      <View style={{ flexDirection: "row", gap: 5 }}>
        {userSelector.friendRequests.includes(item.id) ? (
          <>
            <TouchableOpacity
              style={styles.acceptRequest}
              onPress={() => handleAcceptRequest(item.id)}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sendRequest} // Reuse sendRequest style for reject
              onPress={() => handleRejectRequest(item.id)}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </>
        ) : userSelector.sentFriendRequests.includes(item.id) ? (
          <TouchableOpacity style={styles.requestSent} onPress={() => handleRequestSent(item.id)}>
            <Text style={styles.buttonText}>Request Sent</Text>
          </TouchableOpacity>
        ) : userSelector.friends.includes(item.id) ? (
          <TouchableOpacity style={styles.friends} onPress={() => handleFriends(item.id)}>
            <Text style={styles.buttonText}>Friends</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.sendRequest} onPress={() => handleSendRequest(item.id)}>
            <Text style={styles.buttonText}>Send Request</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        marginTop: StatusBar.currentHeight,
        height: "100%",
        backgroundColor: "black",
        padding: 8,
      }}
    >
      <View>
        <Text style={{ color: "white", fontFamily: "HeroBd", fontSize: 35 }}>
          Friend Requests
        </Text>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by username..."
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor="#888"
      />
      <Text style={styles.sectionTitle}>Suggested Friends</Text>
      <FlatList
        data={suggestedFriends}
        renderItem={renderProfileCard}
        keyExtractor={(item) => item.id}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      />
      <Text style={styles.sectionTitle}>Friend Requests</Text>
      <FlatList
        data={requestList}
        renderItem={renderProfileCard}
        keyExtractor={(item) => item.id}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      />
      {searchQuery.length > 0 && searchResults.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Search Results</Text>
          <FlatList
            data={searchResults}
            renderItem={renderProfileCard}
            keyExtractor={(item) => item.id}
            horizontal={false}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default FriendRequests;

const styles = StyleSheet.create({
  friends: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 10,
  },
  requestSent: {
    backgroundColor: "yellow",
    padding: 5,
    borderRadius: 10,
  },
  acceptRequest: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 10,
  },
  sendRequest: {
    backgroundColor: "#d24dff",
    padding: 5,
    borderRadius: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: "white",
    backgroundColor: "#202020",
  },
  sectionTitle: {
    color: "white",
    fontFamily: "HeroBd",
    fontSize: 20,
    marginVertical: 10,
  },
  profileCard: {
    backgroundColor: "#202020",
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
  },
  name: {
    color: "white",
    fontFamily: "HeroBd",
    fontSize: 20,
  },
  email: {
    color: "white",
    fontFamily: "HeroBd",
    fontSize: 17,
  },
  buttonText: {
    color: "black",
    fontFamily: "HeroBd",
    fontSize: 15,
  },
});