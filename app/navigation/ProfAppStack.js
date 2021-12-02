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

import font from '../config/font';
import colors from '../config/colors';

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
      <Tab.Screen name="Home" component={ProfHome} />
      <Tab.Screen name="Feed" component={Profrequests} />
      <Tab.Screen name="Blog" component={ProfBlog} />
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
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
