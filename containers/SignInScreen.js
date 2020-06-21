import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/core";
import { Text, TextInput, View, TouchableOpacity, SafeAreaView, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SignInScreen = ({ setTokenId }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();


  const connexion = async () => { 
    try {
      if (!email || !password) Alert.alert("Champs à remplir");
      else {
        const response = await axios.post("https://airbnb-backend-db.herokuapp.com/user/log_in",
          {
            email, password 
          }
        );
        setTokenId(response.data.token, response.data.id);
      }
    } catch (error) { 
      if (error.response) {
        if (error.response.data.error === "Email not found") Alert.alert("Adresse email inexistante")
        else if (error.response.data.error === "Wrong password") Alert.alert("Mauvais mot de passe");
      }
    }
  }

  return (
    <KeyboardAwareScrollView extraScrollHeight={110} contentContainerStyle={styles.container}>
      <SafeAreaView style={styles.subcontainer}>

        <AntDesign name="home" size={150} color="white" />

        <View style={styles.center}>
          <TextInput value={email} onChangeText={text => setEmail(text)} placeholder="email" autoCapitalize="none" style={styles.input} placeholderTextColor="white" />
          <TextInput value={password} onChangeText={text => setPassword(text)} placeholder="mot de passe" secureTextEntry={true} autoCapitalize="none" style={styles.input} placeholderTextColor="white" />

          <TouchableOpacity title="Sign in" onPress={connexion} style={styles.buttonConnexion}>
            <Text style={styles.connexion}>Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { navigation.navigate("SignUp"); }} style={styles.buttonNoAccount}>
            <Text style={styles.noAccount}>Pas de compte ? S'inscrire</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F35960",
    justifyContent: "center",
    alignItems: "center",
  },
  subcontainer: {
    alignItems: "center",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50
  },
  input: {
    color: "white",
    borderBottomColor: "white",
    borderBottomWidth: 1,
    width: 300,
    height: 35,
    paddingLeft: 15,
    marginBottom: 30,
  },
  connexion: {
    color: "#F35960",
    fontSize: 22,
  },
  buttonConnexion: {
    width: 180,
    height: 65,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 15,
  },
  noAccount: {
    color: "white",
    textDecorationLine: "underline",
  }
});

export default SignInScreen;