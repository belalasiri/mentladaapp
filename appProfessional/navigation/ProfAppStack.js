import React from 'react';
import {View, Image} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';


import ProfHome from '../professional/screens/ProfHome'
import ProfProfile from '../professional/screens/ProfProfile'
import ProfBlog from '../professional/screens/ProfBlog'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const ProfAppStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            color = '#67D8AF';
          } else if (route.name === 'Blog') {
            iconName = focused ? 'layers' : 'layers-outline';
            color = colors.primary;
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
            color = '#6D768E';
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
        name="Blog"
        component={ProfBlog}
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

export default ProfAppStack;

