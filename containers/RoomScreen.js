import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback } from "react-native";
import { useRoute } from "@react-navigation/core";
import axios from "axios";
import RoomCard from "../components/RoomCard";
import MapView from "react-native-maps";
import ActivityIndic from '../components/ActivityIndic';

const RoomScreen = () => {
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { params } = useRoute();

  useEffect(() => {
    const fetchData = async () => {
      try {
      const response = await axios.get(`https://airbnb-backend-db.herokuapp.com/room/${params.id}`); /* déterminer dans HomeScreen */
      setData(response.data)
      setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [params.id]);


  return (
    <ScrollView>
      {isLoading ? 
        (<ActivityIndic />)
      : (
        <View> 
          <RoomCard data={data} val={0} />

          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.description}>{data.description}</Text>

          <View style={styles.mapViewContainer}>
            <MapView scrollEnabled={false} style={styles.mapView}
              initialRegion={{ latitude: data.location[1], longitude: data.location[0], latitudeDelta: 0.02, longitudeDelta: 0.02 }}
            >
              <MapView.Marker coordinate={{ latitude: data.location[1], longitude: data.location[0] }} title={data.title} description={data.description} />
            </MapView>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 25,
    marginBottom: 15,
    marginRight: 20,
    marginLeft: 20,
    fontSize: 18,
  },
  description: {
    marginRight: 20,
    marginLeft: 20,
    fontSize: 16,
    textAlign: "justify",
  },
  mapView: {
    flex: 1, 
    height: 200,
  },
  mapViewContainer: {
    margin: 20,
  }
});

export default RoomScreen;

//initialRegion pour le centrage de la carte, 0.02 pour le zoom
//title, description sur le Marker permettent d'afficher des infos lorsqu'on clique sur l'icone position