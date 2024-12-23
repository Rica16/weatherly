import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '.';
import About from './About';
import ManageCities from './ManageCities';
import NextDayForecast from './NextDayForecast';



const Stack = createStackNavigator();

export default function App() {
  return (
      <Stack.Navigator initialRouteName="Home"screenOptions={{ headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="ManageCities" component={ManageCities} />
        <Stack.Screen name="NextDayForecast" component={NextDayForecast} />
      </Stack.Navigator>

  );
}
