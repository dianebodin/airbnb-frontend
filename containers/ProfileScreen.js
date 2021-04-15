import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, Image, ScrollView, Alert, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AntDesign } from '@expo/vector-icons';
import axios from "axios";
import ActivityIndic from '../components/ActivityIndic';

const ProfileScreen = ({ user, setUser }) => {

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [photo, setPhoto] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://airbnb-backend-db.herokuapp.com/user/${user.id}`,
        {
          headers: { Authorization: "Bearer " + user.token }
        });

        setData(response.data);
        if (response.data.account.picture) setPhoto(response.data.account.picture.secure_url);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [photo]);
  
  const imgProfileSaved = async () => {
    const cameraRollPerm = await ImagePicker.requestCameraRollPermissionsAsync(); //permissions
    if (cameraRollPerm.status === "granted") {
      try {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1] });
        const uri = pickerResult.uri;
        const uriParts = uri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const formData = new FormData();

        formData.append("picture", { uri, name: `photo.${fileType}`, type: `image/${fileType}` }); //pour envoyer la photo au serveur
        const uploadPic = await axios.put(`https://airbnb-backend-db.herokuapp.com/user/upload_picture/${user.id}`, formData,
        {
          headers: {
            Authorization: "Bearer " + user.token,
          }
        });
        
        //console.log(uploadPic.data);
        setPhoto(uploadPic.data.account.picture.secure_url);
      } catch (error) {
          Alert.alert("Erreur pour la photo de profil")
        } finally {}
    }
  };

  const infosUpdate = async () => {
    try {
      let formData = new FormData();
      if (!name && !username && !email && !description) Alert.alert("Veuillez remplir au moins un champs");
      else {
        formData.append("name", name);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("description", description);

        const response = await axios.put(`https://airbnb-backend-db.herokuapp.com/user/update/${user.id}`, formData,
        {
          headers: {
            Authorization: "Bearer " + user.token
          }
        });

        setData(response.data);
        setName("");
        setUsername("");
        setEmail("");
        setDescription("");
        Alert.alert("Profil mis à jour !");
      } 
    } catch (error) {
      if (error.response.data.error === "Username already used") Alert.alert("Le pseudo est déjà utilisé");
      else if (error.response.data.error === "Email already used") Alert.alert("L'email est déjà utilisé");
      else if (error.response.data.error === "Email: incorrect format") Alert.alert("Mauvais format pour l'email");
    }
  };

  return (
    <ScrollView style={styles.scroll}>

      {isLoading ? <ActivityIndic />
        : (
          <KeyboardAwareScrollView extraScrollHeight={110} contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={imgProfileSaved} style={styles.imgContainer}>
            {photo.length > 0 ? <Image style={styles.img} source={{ uri: photo || data.picture[0].url }} />
              : (
                <View style={styles.img}>
                  <AntDesign name="plus" size={35} color="#E1E1E1" style={styles.add} />
                </View>
              )
            }
            </TouchableOpacity>

            <TextInput defaultValue={name} onChangeText={text => setName(text)} placeholder={data.account.name} placeholderTextColor="#BBBBBB" autoCapitalize="none" style={styles.input} />
            <TextInput defaultValue={email} onChangeText={text => setEmail(text)} placeholder={data.email} placeholderTextColor="#BBBBBB" autoCapitalize="none" style={styles.input} />
            <TextInput defaultValue={username} onChangeText={text => setUsername(text)} placeholder={data.account.username} placeholderTextColor="#BBBBBB" autoCapitalize="none" style={styles.input} />
            <TextInput multiline={true} defaultValue={description} onChangeText={text => setDescription(text)} placeholder={data.account.description} placeholderTextColor="#BBBBBB" autoCapitalize="none" style={styles.textarea} />

            <TouchableOpacity onPress={infosUpdate} style={styles.updateButton}>
              <Text style={styles.updateButtonText}>Mettre à jour</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setUser(null) }} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Se déconnecter</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        )
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    height: 140,
    width: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: "#F35960",
    marginTop: 50,
    marginBottom: 30,
  },
  add: {
    flex: 1, 
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 54,
  },
  input: {
    borderBottomColor: "#F35960",
    borderBottomWidth: 1,
    color: "black",
    width: 300,
    height: 35,
    paddingLeft: 15,
    marginBottom: 30,
  },
  textarea: {
    width: 300,
    height: 90,
    borderWidth: 1,
    borderColor: "#F35960",
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    paddingLeft: 15,
  },
  updateButton: {
    width: 160,
    height: 55,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#F35960",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  logoutButton: {
    width: 160,
    height: 55,
    borderRadius: 50,
    backgroundColor: "#F35960",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 50,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
  },
  updateButtonText: {
    color: "#F35960",
    fontSize: 16,
  }
});

export default ProfileScreen;