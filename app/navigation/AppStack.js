import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../patient/screens/HomeScreen';
import ProfileScreen from '../patient/screens/profileScreen';
import BlogScreen from '../patient/screens/BlogScreen';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: () => null,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
