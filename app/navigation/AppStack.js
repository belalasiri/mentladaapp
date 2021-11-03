import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../patient/screens/HomeScreen';
import ProfileScreen from '../patient/screens/profileScreen';
import BlogScreen from '../patient/screens/BlogScreen';
import PostScreen from '../patient/screens/PostScreen';
import MessageScreen from '../patient/screens/MessegeScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../config/colors';

const Stack = createStackNavigator();
// const Tab = createMaterialBottomTabNavigator();
const Tab = createBottomTabNavigator();
// const MainTapScreen = () => {
//   return (
//     <Tab.Navigator activeColor={colors.empty}>
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarColor: '#67D8AF',
//           tabBarLabel: 'Home',
//           tabBarIcon: ({color}) => <Icon name="home" color={color} size={26} />,
//         }}
//       />
//       <Tab.Screen
//         name="Post"
//         component={PostScreen}
//         options={{
//           tabBarLabel: 'Profile',
//           tabBarColor: '#61EDEA',
//           tabBarIcon: ({color}) => (
//             <MaterialCommunityIcons name="account" color={color} size={26} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Blog"
//         component={BlogScreen}
//         options={{
//           tabBarLabel: 'Profile',
//           tabBarColor: '#B283E4',
//           tabBarIcon: ({color}) => (
//             <MaterialCommunityIcons name="account" color={color} size={26} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Message"
//         component={MessageScreen}
//         options={{
//           tabBarLabel: 'Profile',
//           tabBarColor: '#FFC646',
//           tabBarIcon: ({color}) => (
//             <MaterialCommunityIcons name="account" color={color} size={26} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{
//           tabBarLabel: 'Profile',
//           tabBarColor: '#6D768E',
//           tabBarIcon: ({color}) => (
//             <MaterialCommunityIcons name="account" color={color} size={26} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

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
            iconName = focused ? 'grid' : 'grid-outline';
            color = '#61EDEA';
          } else if (route.name === 'Blog') {
            iconName = focused ? 'reader' : 'reader-outline';
            color = '#B283E4';
          } else if (route.name === 'Message') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
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

const MainTapScreen = () => {
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
      <Stack.Screen
        name="Blog"
        component={BlogScreen}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="Post"
        component={PostScreen}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="Message"
        component={MessageScreen}
        options={{
          header: () => null,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
