import React, { useState, useEffect } from 'react';
import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  StyleSheet,
  StatusBar,
} from 'react-native';

import Home from './screens/inner/Home';
import Auth from './screens/outer/Auth';
import LoadingComponent from './components/LoadingComponent';
import AsyncStorage from '@react-native-community/async-storage';
import CONST from './apiData';
GoogleSignin.configure({
  webClientId: CONST.WebClientId
});

const App = () => {

  const Stack = createStackNavigator();

  const [loading, setLoading] = useState(false)
  const [userstatus, setUserstatus] = useState(null)

  _checkUser = async () => {
    // console.log('IN _checkUser');
    setLoading(true) 
    AsyncStorage.getAllKeys().then((value) => {
      //if no keys are present means user is not logged in
      if (value.length) {
        // console.log('In If value.length: ', value.length)
        setUserstatus(true)
        setLoading(false)
      } else {
        // console.log('In else ')
        setUserstatus(false)
        setLoading(false)
      }
    }).catch((error) => {
      setLoading(false)
      // console.log('error fetching all keys from AsyncStorage: ', error)
    });
  }

  useEffect(() => {
    console.log('App.js UseEffect')
    try {
      auth().onAuthStateChanged((user) => {
        // console.log('in onAuthStateChanged: ', user)
        if(user){
          setUserstatus(true)
        }else{
          setUserstatus(false)
        }
      })
    } catch (error) {
      // console.log('onAuthStateChanged Error: ', error)
    }

    _checkUser()
    return () => { console.log('App.js cleanup') }
  }, [])

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator>
          {
            userstatus ?
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              /> :
              <Stack.Screen
                name="Auth"
                component={Auth}
                options={{ headerShown: false }}
              />
          }
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
});

export default App;
