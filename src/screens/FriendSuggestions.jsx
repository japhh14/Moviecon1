import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectStateUser } from "../features/slices/userSlice";
import { firestore_db } from "../../firebase";

const FriendSuggestions = ({ navigation }) => {
  console.log("FriendSuggestions rendered"); // Debug log
  const userSelector = useSelector(selectStateUser);
  const { uid, favorites, watchlist, friends } = userSelector || {};
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAllUsers = async () => {
    console.log("Fetching users from Firestore, current UID:", uid);
    if (!firestore_db) {
      console.error("Firestore instance is not initialized");
      setError("Firestore is not initialized. Check your firebase.js configuration.");
      return [];
    }
    try {
      const querySnapshot = await getDocs(collection(firestore_db, "user"));
      const users = [];
      const seenUids = new Set();
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (doc.id !== uid && !seenUids.has(doc.id)) {
          seenUids.add(doc.id);
          users.push({
            uid: doc.id,
            displayName: userData.displayName || "Unknown",
            username: userData.username || "no username",
            photoUrl: userData.photoUrl || null,
            favorites: userData.favorites || [],
            watchlist: userData.watchlist || [],
          });
        }
      });
      console.log("Fetched users (excluding current):", users.length);
      return users;
    } catch (error) {
      console.error("Error fetching users:", error.message);
      setError(`Failed to fetch users: ${error.message}`);
      return [];
    }
  };

  const calculateSimilarity = (currentUserData, otherUserData) => {
    const currentFavorites = currentUserData.favorites || [];
    const currentWatchlist = currentUserData.watchlist || [];
    const otherFavorites = otherUserData.favorites || [];
    const otherWatchlist = otherUserData.watchlist || [];
    const favMatch = currentFavorites.filter((id) => otherFavorites.includes(id));
    const watchMatch = currentWatchlist.filter((id) => otherWatchlist.includes(id));
    return favMatch.length + watchMatch.length;
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      console.log("Starting fetchSuggestions, UID:", uid, "Favorites:", favorites, "Watchlist:", watchlist, "Friends:", friends);
      setLoading(true);
      setError(null);
      if (!uid) {
        console.warn("No UID available, skipping fetch");
        setLoading(false);
        return;
      }
      try {
        const users = await getAllUsers();
        const currentUserData = { favorites: favorites || [], watchlist: watchlist || [] };
        const withScores = users.map((user) => ({
          ...user,
          score: calculateSimilarity(currentUserData, user),
        }));
        const sortedUsers = withScores
          .filter((user) => user.score > 0 && !friends?.includes(user.uid) && user.uid !== uid)
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        console.log("Suggested friends:", sortedUsers);
        setSuggestedFriends(sortedUsers);
      } catch (error) {
        console.error("Error in fetchSuggestions:", error.message);
        setError(`Failed to fetch suggestions: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [uid, favorites, watchlist, friends]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#202020",
        marginBottom: 10,
        borderRadius: 10,
      }}
      onPress={() => navigation.navigate("OtherProfile", { uid: item.uid })}
    >
      {item.photoUrl ? (
        <Image
          source={{ uri: item.photoUrl }}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
        />
      ) : (
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#d24dff",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Text style={{ color: "white", fontSize: 20 }}>
            {item.displayName?.charAt(0).toUpperCase() || "U"}
          </Text>
        </View>
      )}
      <View>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          {item.displayName} (@{item.username})
        </Text>
        <Text style={{ color: "#aaa", fontSize: 14 }}>Match Score: {item.score}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}
      >
        <ActivityIndicator size="large" color="#d24dff" />
        <Text style={{ color: "white", marginTop: 10 }}>Loading user data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black", padding: 15 }}>
      <Text style={{ color: "white", fontSize: 24, marginBottom: 15, fontWeight: "bold" }}>
        Friend Suggestions
      </Text>
      <FlatList
        data={suggestedFriends}
        renderItem={renderItem}
        keyExtractor={(item) => item.uid}
        ListEmptyComponent={() => (
          <Text style={{ color: "#aaa", textAlign: "center" }}>
            No suggestions found. Add more movies to your favorites or watchlist.
          </Text>
        )}
      />
    </View>
  );
};

export default FriendSuggestions;