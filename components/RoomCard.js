import React from 'react';
import { View, Text, Image, StyleSheet } from "react-native";
import Carousel from "react-native-snap-carousel";
import { Ionicons } from "@expo/vector-icons";

const RoomCard = ({ data, val }) => {

  const stars = (num) => {
    let tab = [];
    for (let i = 0; i < num; i++) {
      if (i < num-1) tab.push(<Ionicons key={i} name="ios-star" size={25} color="#F5B000" style={{ marginRight: 3 }} />);
      else tab.push(<Ionicons key={i} name="ios-star" size={25} color="#BBBBBB" style={{ marginRight: 3 }} />);
    }
    return tab;
  };

  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Carousel data={data.pictures} renderItem={({ item }) => <Image style={styles.imgCarousel} source={{ uri: item }} />} sliderWidth={370} itemWidth={370} loop={true} />

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{data.price} €</Text>
        </View>
      </View>

      <View style={styles.infosContainer}>
        <View>
          <Text numberOfLines={1} style={val ? styles.title : styles.hidden }>{data.title}</Text>
          <View style={styles.starsAndReviews}>
            <View style={styles.stars}>
              {stars(data.ratingValue)}
            </View>
            <Text style={styles.reviews}>{data.reviews} avis</Text>
          </View>
        </View>
        <Image source={ data.user.account.picture ? {uri: data.user.account.picture.secure_url} : null} style={styles.imgProfile} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 35,
  },
  title: {
    width: 270,
    fontSize: 18,
    marginBottom: 5,
    marginTop: 15,
  },
  imgContainer: {
    position: "relative",
  },
  price: {
    color: "white",
  },
  priceContainer: {
    position: "absolute", 
    bottom: 10,
    height: 30,
    width: 65,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  imgProfile: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginRight: 5,
    borderWidth: 1,
    borderColor: "#F1485C",
  },
  imgCarousel: {
    height: 215,
  },
  stars: {
    flexDirection: "row",
  },
  reviews: {
    fontSize: 16,
    color: "#BBBBBB",
    marginLeft: 15,
  },
  starsAndReviews: {
    flexDirection: "row",
    alignItems: "center",
  },
  infosContainer: {    
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  hidden: {
    opacity: 0,
  }
});

export default RoomCard;