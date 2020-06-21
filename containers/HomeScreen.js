import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from "react-native";
import axios from "axios";
import { FlatList, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import RoomCard from "../components/RoomCard";
import ActivityIndic from '../components/ActivityIndic';

const HomeScreen = () => {

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();


  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("https://airbnb-backend-db.herokuapp.com/rooms");
      setData(response.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);


  return (
    <View>
      {isLoading ? 
        (<ActivityIndic />)
        : 
        (
          <FlatList data={data} keyExtractor={item => String(item._id)} renderItem={({ item, index }) => 
            (
              <>
              <TouchableWithoutFeedback onPress={() => navigation.navigate("Room", { id: item._id })}>
                <RoomCard data={item} val={1} />
              </TouchableWithoutFeedback>
              <View style={index !== data.length-1 ? styles.line : styles.no} />
              </>
            )
          } />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    flex: 1,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 35,
    borderBottomColor: "#BBBBBB",
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  no: {
    marginBottom: 40,
  }
});

export default HomeScreen;