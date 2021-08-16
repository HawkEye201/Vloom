import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View, Button, Image, ImageBackground, TouchableOpacity } from 'react-native';
import Start from './src/screens/Start'
import { NavigationContainer } from '@react-navigation/native';
import {AntDesign} from '@expo/vector-icons'
import {Pacifico_400Regular, useFonts} from '@expo-google-fonts/pacifico'
import AppLoading from 'expo-app-loading'

function Home({navigation}){
  let [fontsLoaded] = useFonts({ Pacifico_400Regular});
  if(!fontsLoaded){
    return <AppLoading />
  }
  return (
      <View style = {styles.container}>
        <ImageBackground source = {require('./assets/111.jpg')} style = {{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}  >
          <Image source = {require('./assets/logo.png')} style = {{width: 100, height: 100}}></Image>
          <Text style = {{fontFamily: 'Pacifico_400Regular', fontSize: 40 , color: '#2e2e2e'}}>Vloom</Text>
          <TouchableOpacity onPress =  {() => navigation.navigate('Start')}>
              <AntDesign name = {'rightcircleo'} size = {40} style = {{marginTop: 100}} />
          </TouchableOpacity>
        </ImageBackground>
      </View>
  );
}

const stack = createNativeStackNavigator();

function Mystack() {
  return (
    <stack.Navigator>
      <stack.Screen name = "Home" component = {Home} options = {{headerShown: false}} />
      <stack.Screen name = "Start" component = {Start} options = {{headerShown: false}} />
    </stack.Navigator>
  )
}

export default function App() {
  
  return (
    <NavigationContainer>
      <Mystack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
