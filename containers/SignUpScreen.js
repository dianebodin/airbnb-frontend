import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/core";
import { Text, TextInput, View, ScrollView, SafeAreaView, Alert, StyleSheet } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SignUpScreen = ({ setTokenId }) => {

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const navigation = useNavigation();

  const createAccount = async () => {
    try {
      if (!email || !username || !name || !description || !password || !password2) Alert.alert("Champs à remplir");
      else if (password !== password2) Alert.alert("Les mots de passe ne sont pas identiques");
      else if (password.length < 5) Alert.alert("Le mot de passe contient au moins 5 caractères");
      else {
        const response = await axios.post("https://airbnb-backend-db.herokuapp.com/user/sign_up",
          {
            email, username, name, description, password
          }
        );
        setTokenId(response.data.token, response.data.id);
      }
    } catch (error) { 
      if (error.response) {
        if (error.response.data.error === "Username already used") Alert.alert("Le pseudo est déjà utilisé");
        else if (error.response.data.error === "Email already used") Alert.alert("L'email est déjà utilisé");
        else if (error.response.data.error === "Email: incorrect format") Alert.alert("Mauvais format pour l'email");
      } 
    }
  }

  return (
    <ScrollView style={styles.scroll}>
    <KeyboardAwareScrollView extraScrollHeight={110} contentContainerStyle={styles.container}>
    <SafeAreaView style={styles.subcontainer}>
      <Text style={styles.join}>Rejoignez-nous !</Text>

      <View>
        <TextInput value={email} onChangeText={text => setEmail(text)} placeholder="email" autoCapitalize="none" style={styles.input} placeholderTextColor="white" />
        <TextInput value={username} onChangeText={text => setUsername(text)} placeholder="pseudo" autoCapitalize="none" style={styles.input} placeholderTextColor="white" />
        <TextInput value={name} onChangeText={text => setName(text)} placeholder="nom" autoCapitalize="none" style={styles.input} placeholderTextColor="white" />
        <TextInput multiline={true} value={description} onChangeText={text => setDescription(text)} placeholder="présentez-vous..." autoCapitalize="none" style={styles.textarea} placeholderTextColor="white" />

        <TextInput value={password} onChangeText={text => setPassword(text)} placeholder="mot de passe" secureTextEntry={true} autoCapitalize="none" style={styles.input} placeholderTextColor="white" />
        <TextInput value={password2} onChangeText={text => setPassword2(text)} placeholder="confirmez le mot de passe" secureTextEntry={true} autoCapitalize="none" style={styles.input} placeholderTextColor="white" />

        <View style={styles.containerBottom}>
          <TouchableOpacity title="Sign up" onPress={createAccount} style={styles.buttonCreate}>
            <Text style={styles.create}>S'inscrire</Text>
          </TouchableOpacity>  
          <TouchableOpacity onPress={() => { navigation.navigate("SignIn"); }}>
            <Text style={styles.account}>Déjà un compte ? Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#F35960",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  subcontainer: {
    alignItems: "center",
  },
  join: {
    color: "white",
    fontSize: 25,
    paddingBottom: 50,
    paddingTop: 60,
  },
  input: {
    color: "white",
    borderBottomColor: "white",
    borderBottomWidth: 1,
    width: 300,
    height: 35,
    paddingLeft: 15,
    marginBottom: 25,
  },
  textarea: {
    width: 300,
    height: 90,
    color: "white",
    borderColor: "white",
    borderWidth: 1,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    paddingLeft: 15,
    marginBottom: 20,
    marginTop: 10,
  },
  create: {
    color: "#F35960",
    fontSize: 22,
  },
  buttonCreate: {
    width: 180,
    height: 65,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
  },
  account: {
    color: "white",
    textDecorationLine: "underline",
    paddingBottom: 50,
  },
  containerBottom: {
    justifyContent: "center",
    alignItems: "center",
  }
});

export default SignUpScreen;