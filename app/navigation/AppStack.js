import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../patient/screens/HomeScreen';
import PostScreen from '../patient/screens/PostScreen';
import AddPostScreen from '../patient/screens/AddPostScreen';
import BlogScreen from '../patient/screens/BlogScreen';
import MessageScreen from '../patient/screens/MessegeScreen';
import ChatScreen from '../patient/screens/ChatScreen';
import ProfileScreen from '../patient/screens/profileScreen';
import EditProfileScreen from '../patient/screens/EditProfileScreen';
import ProfProfile from '../patient/screens/ProfProfile';
import patientChat from '../patient/screens/patientChat';
import professionalList from '../patient/screens/professionalList';
import TermsAndPrivacy from '../patient/screens/TermsAndPrivacy';
import Help from '../patient/screens/Help';
import sessionPlan from '../patient/screens/sessionPlan';
import BlogContent from '../patient/screens/BlogContent';
import colors from '../config/colors';
import Notification from '../patient/screens/Notification';
import Details from '../patient/screens/categoryDetails';
import planDetails from '../patient/screens/planDetails';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Tab.Navigator
      initialRouteName="Homes"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';

            color = '#67D8AF';
            // size = 30;
          } else if (route.name === 'Feed') {
            iconName = focused ? 'layers' : 'layers-outline';
            color = colors.primary;
          } else if (route.name === 'Blog') {
            iconName = focused ? 'grid' : 'grid-outline';
            color = '#61EDEA';
          } else if (route.name === 'Message') {
            iconName = focused
              ? 'chatbox-ellipses'
              : 'chatbox-ellipses-outline';
            color = '#FFC646';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
            color = '#c9a8ec';
          }
          return <Icon name={iconName} size={27} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 65,
          backgroundColor: '#fff',
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <Tab.Screen name="Feed" component={PostScreen} />
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
        <Stack.Screen name="ProfProfile" component={ProfProfile} />
        {/* <Stack.Screen name="Chat" component={ChatScreen} /> */}
        <Stack.Screen name="AddPost" component={AddPostScreen} />
        <Stack.Screen name="HomeProfile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Chat" component={patientChat} />
        <Stack.Screen name="professionaList" component={professionalList} />
        <Stack.Screen name="TermsAndPrivacy" component={TermsAndPrivacy} />
        <Stack.Screen name="Help" component={Help} />
        <Stack.Screen name="sessionPlan" component={sessionPlan} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen
          name="Details"
          component={Details}
          options={() => ({headerShown: true})}
        />
        <Stack.Screen name="BlogContent" component={BlogContent} />
        <Stack.Screen name="planDetails" component={planDetails} />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
