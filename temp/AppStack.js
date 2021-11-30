import React, {useContext} from 'react';
import {View, Image, TouchableOpacity, Text, Animated} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {AuthContext} from './AuthProvider';

import HomeScreen from '../patient/screens/HomeScreen';
import PostScreen from '../patient/screens/PostScreen';
import AddPostScreen from '../patient/screens/AddPostScreen';
import BlogScreen from '../patient/screens/BlogScreen';
import MessageScreen from '../patient/screens/MessegeScreen';
import ChatScreen from '../patient/screens/ChatScreen';
import ProfileScreen from '../patient/screens/profileScreen';
import EditProfileScreen from '../patient/screens/EditProfileScreen';
import ProfProfile from '../patient/screens/ProfProfile';
import font from '../config/font';
import colors from '../config/colors';
import sessionPlan from '../patient/screens/sessionPlan';

import Home from '../Test/Home';
import Feed from '../Test/Feed';
import Profile from '../Test/Profile';
import Notifications from '../Test/Notifications';
import Settings from '../Test/Settings';
import Chat from '../Test/Chat';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Post" component={PostScreen} />
      <Tab.Screen name="Blog" component={BlogScreen} />
      <Tab.Screen name="Message" component={MessageScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppStack() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Homes" component={HomeStack} />
        <Stack.Screen name="Feed" component={Feed} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
