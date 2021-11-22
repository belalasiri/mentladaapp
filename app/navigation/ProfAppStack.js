import React from 'react';
import {View, Image} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

import ProfHome from '../Professional/screans/ProfHome';
import ProfProfile from '../Professional/screans/ProfProfile';

import font from '../config/font';
import colors from '../config/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Homes"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            color = '#67D8AF';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'home' : 'home-outline';
            color = '#67D8AF';
          }
          return <Icon name={iconName} size={27} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          backgroundColor: '#fff',
        },
      })}>
      <Tab.Screen
        name="Home"
        component={ProfHome}
        options={({route}) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfProfile}
        options={({route}) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
        })}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
