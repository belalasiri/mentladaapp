import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../patient/screens/HomeScreen';
import ProfileScreen from '../patient/screens/profileScreen';
import BlogScreen from '../patient/screens/BlogScreen';
import PostScreen from '../patient/screens/PostScreen';
import MessageScreen from '../patient/screens/MessegeScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// const FeedStack =({ navigation }) => (
//   <Stack.Navigator>
//     <Stack.Screen
//     name="Mentlada Social"
//     component={PostScreen}
//     options

//     />
//   </Stack.Navigator>
// )

const AppStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            color = '#67D8AF';
            // size = 30;
          } else if (route.name === 'Post') {
            iconName = focused ? 'layers' : 'layers-outline';
            color = '#61EDEA';
          } else if (route.name === 'Blog') {
            iconName = focused ? 'grid' : 'grid-outline';
            color = '#B283E4';
          } else if (route.name === 'Message') {
            iconName = focused
              ? 'chatbox-ellipses'
              : 'chatbox-ellipses-outline';
            color = '#FFC646';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
            color = '#6D768E';
          }
          return <Icon name={iconName} size={27} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          backgroundColor: '#fff',
          position: 'absolute',
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{header: () => null}}
      />
      <Tab.Screen
        name="Post"
        component={PostScreen}
        // component={FeedStack}
        options={{header: () => null}}
      />
      <Tab.Screen
        name="Blog"
        component={BlogScreen}
        options={{header: () => null}}
      />
      <Tab.Screen
        name="Message"
        component={MessageScreen}
        options={{header: () => null}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{header: () => null}}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
