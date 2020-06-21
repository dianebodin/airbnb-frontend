import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import axios from "axios";
import { useNavigation } from "@react-navigation/core";

const AroundMeSreen = () => {

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const navigation = useNavigation();


  useEffect(() => {
    const askPermission = async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status === "granted") { //a autorisé la localisation
        const location = await Location.getCurrentPositionAsync({}); //la position de mon tel

        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
        setIsLoading(false);
      } else {
        Alert.alert("Veuillez accepter la permission pour la localisation");
      }
    };
    askPermission();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://airbnb-backend-db.herokuapp.com/rooms/around?latitude=${latitude}&longitude=${longitude}`);
        setData(response.data);
        //console.log(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (latitude && longitude) fetchData();
  }, [latitude, longitude]);


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    {isLoading === false ? (

      <MapView showsUserLocation={true} style={{ width: "100%", flex: 1 }}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.18,
          longitudeDelta: 0.18
        }}
      >
        {data.map((marker) => {
          return (
            <MapView.Marker key={marker._id} coordinate={{ latitude: marker.location[1], longitude: marker.location[0] }}>
              <MapView.Callout onPress={() => navigation.navigate("Room", { id: marker._id })}>
                <Text>{marker.title}</Text>
              </MapView.Callout>
            </MapView.Marker>
          );
        })}
      </MapView>

    ) : null}
    </View>
  );
}

export default AroundMeSreen;

//MapView.Callout: lien map