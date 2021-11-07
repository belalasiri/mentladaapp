import React from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../patient/screens/HomeScreen';
import ProfileScreen from '../patient/screens/profileScreen';
import BlogScreen from '../patient/screens/BlogScreen';
import PostScreen from '../patient/screens/PostScreen';
import MessageScreen from '../patient/screens/MessegeScreen';
import AddPostScreen from '../patient/screens/AddPostScreen';
import font from '../config/font';
import colors from '../config/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const FeedStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Mentlada Social"
      component={PostScreen}
      options={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: colors.primary,
          fontFamily: font.title,
          fontSize: 19,
        },
        headerStyle: {
          shadowColor: '#fff',
          elevation: 0,
        },
        headerRight: () => (
          <View style={{marginRight: 10, marginTop: 5}}>
            <FontAwesome5.Button
              name="plus"
              // size={22}
              backgroundColor="#fff"
              color={colors.primary}
              onPress={() => navigation.navigate('AddPost')}
            />
          </View>
        ),
        // headerLeft: () => (
        //   <View style={{marginLeft: 10, marginTop: 5}}>
        //     <Image
        //       source={require('../assets/image/logo.png')}
        //       style={{height: 40, width: 40}}
        //     />
        //   </View>
        // ),
      }}
    />
    <Stack.Screen
      name="AddPost"
      component={AddPostScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#f7f3fc',
          shadowColor: colors.postL,
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color={colors.p} />
          </View>
        ),
      }}
    />
  </Stack.Navigator>
);

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
        component={HomeScreen}
        options={{header: () => null}}
      />
      <Tab.Screen
        name="Post"
        // component={PostScreen}
        component={FeedStack}
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
