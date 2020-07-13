import React, { useState, useEffect } from 'react';
import { AsyncStorage, StyleSheet} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import HomeScreen from "./containers/HomeScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import AroundMeScreen from "./containers/AroundMeScreen";
import RoomScreen from "./containers/RoomScreen";
import ActivityIndic from './components/ActivityIndic';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const App = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({}); //objet qui contient 2 clés: token et id


  const setTokenId = async (token, id) => {
    if (token && id) {
      AsyncStorage.setItem("userToken", token);
      AsyncStorage.setItem("userId", id);
    } else {
      AsyncStorage.removeItem("userToken");
    }
    setUser({ token: token, id: id });
  };


  useEffect(() => {
    const bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");
      setUser({ token: userToken, id: userId });
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);


  return (
    <NavigationContainer>
    {isLoading ? 
    
    (<ActivityIndic />)
    
    : user === null ? ( 
      <Stack.Navigator>
        <Stack.Screen name="SignIn" options={{ header: () => null, animationEnabled: false }}>
          {() => <SignInScreen setTokenId={setTokenId} />}
        </Stack.Screen>

        <Stack.Screen name="SignUp" options={{ header: () => null, animationEnabled: false }}>
          {() => <SignUpScreen setTokenId={setTokenId} />}
        </Stack.Screen>
      </Stack.Navigator>
    ) : (

      <Stack.Navigator>
        <Stack.Screen name="Tab" options={{ header: () => null, animationEnabled: false }}>

          {() => (
            <Tab.Navigator tabBarOptions={{ activeTintColor: "black", inactiveTintColor: "white", style: { backgroundColor: "#F1485C" } }}>

              <Tab.Screen name="Home" options={{ tabBarLabel: "Home", tabBarIcon: ({ color, size }) => (<AntDesign name="home" size={size} color={color} />)}}>
                {() => (
                  <Stack.Navigator>
                    <Stack.Screen name="Home" options={{ title: "MonAirbnb", headerStyle: { backgroundColor: "#F35960" }, headerTitleStyle: { color: "white" }, headerTitleAlign: "center" }}>
                      {() => <HomeScreen />}
                    </Stack.Screen>

                    <Stack.Screen name="Room" options={{ title: "Room", headerStyle: { backgroundColor: "#F35960" }, headerTitleStyle: { color: "white" }, headerTitleAlign: "center", headerBackTitleVisible: false, headerTintColor: "white" }}>
                      {() => <RoomScreen />}
                    </Stack.Screen>
                  </Stack.Navigator>
                )}
              </Tab.Screen>

              <Tab.Screen name="Around Me" options={{ tabBarLabel: "Around Me", tabBarIcon: ({ color, size }) => (<SimpleLineIcons name="location-pin" size={size} color={color} />)}}>
                {() => (
                  <Stack.Navigator>
                    <Stack.Screen name="Around Me" options={{ title: "Around Me", headerStyle: { backgroundColor: "#F35960" }, headerTitleStyle: { color: "white" }, headerTitleAlign: "center" }}>
                    {() => <AroundMeScreen />}
                    </Stack.Screen>
                  </Stack.Navigator>
                )}
              </Tab.Screen>

              <Tab.Screen name="Profile" options={{ tabBarLabel: "Profile", tabBarIcon: ({ color, size }) => (<AntDesign name="user" size={size} color={color} />)}}>
                {() => (
                  <Stack.Navigator>
                    <Stack.Screen name="Profile" options={{ title: "Profile", headerStyle: { backgroundColor: "#F35960" }, headerTitleStyle: { color: "white" }, headerTitleAlign: "center" }}>
                      {() => <ProfileScreen user={user} setUser={setUser} />}
                    </Stack.Screen>
                  </Stack.Navigator>
                )}
              </Tab.Screen>

            </Tab.Navigator>
          )}

        </Stack.Screen>
      </Stack.Navigator>

    )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});

export default App;


