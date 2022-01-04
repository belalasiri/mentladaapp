import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';

import ProfHome from '../Professional/screans/ProfHome';
import ProfProfile from '../Professional/screans/ProfProfile';
import ProfMessage from '../Professional/screans/ProfMessage';
import ProfBlog from '../Professional/screans/ProfBlog';
import ProfChat from '../Professional/screans/subScreens/ProfChat';
import EditProfProfile from '../Professional/screans/subScreens/EditProfProfile';
import Profrequests from '../Professional/screans/Profrequests';
import ProfessionalChat from '../Professional/screans/subScreens/ProfessionalChat';
import professionalMessage from '../Professional/screans/professionalMessage';
import Notification from '../Professional/screans/Notification';
import profileScreen from '../patient/screens/profileScreen';
import BlogContent from '../Professional/screans/subScreens/BlogContent';
import addBlog from '../Professional/screans/subScreens/addBlog';
import font from '../config/font';
import colors from '../config/colors';

import BipolarDisorder from '../Professional/screans/subScreens/Categories/bipolarDisorder';
import Stress from '../Professional/screans/subScreens/Categories/stress';
import Dementia from '../Professional/screans/subScreens/Categories/dementia';
import Insomnia from '../Professional/screans/subScreens/Categories/insomnia';
import Anxiety from '../Professional/screans/subScreens/Categories/anxiety';
import Schizophrenia from '../Professional/screans/subScreens/Categories/schizophrenia';
import BlogCustom from '../Professional/components/BlogCustom';
import AuthorCustom from '../Professional/components/AuthorCustom';
import LicenseCertificate from '../Professional/screans/subScreens/licenseCertificate';

import Details from '../Professional/screans/subScreens/categoryDetails';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Tab.Navigator
      initialRouteName="Homes"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';

            color = '#67D8AF';
            // size = 30;
          } else if (route.name === 'Requests') {
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
      <Tab.Screen name="Home" component={ProfHome} />
      <Tab.Screen
        name="Requests"
        component={Profrequests}
        options={() => ({headerShown: true})}
      />
      <Tab.Screen
        name="Blog"
        component={ProfBlog}
        options={() => ({headerShown: true})}
      />
      <Tab.Screen
        name="Message"
        component={professionalMessage}
        options={() => ({headerShown: true})}
      />
      <Tab.Screen name="Profile" component={ProfProfile} />
    </Tab.Navigator>
  );
}

export default function AppStack() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Homes" component={HomeStack} />
        <Stack.Screen name="EditProfile" component={EditProfProfile} />
        <Stack.Screen
          name="Chat"
          component={ProfessionalChat}
          options={() => ({headerShown: true})}
        />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="profileScreen" component={profileScreen} />
        <Stack.Screen name="BlogContent" component={BlogContent} />
        <Stack.Screen name="addBlog" component={addBlog} />
        <Stack.Screen name="BipolarDisorder" component={BipolarDisorder} />
        <Stack.Screen name="Stress" component={Stress} />
        <Stack.Screen name="Dementia" component={Dementia} />
        <Stack.Screen name="Insomnia" component={Insomnia} />
        <Stack.Screen name="Anxiety" component={Anxiety} />
        <Stack.Screen name="Schizophrenia" component={Schizophrenia} />
        <Stack.Screen name="BlogCustom" component={BlogCustom} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="AuthorCustom" component={AuthorCustom} />
        <Stack.Screen
          name="LicenseCertificate"
          component={LicenseCertificate}
        />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
