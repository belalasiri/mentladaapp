import React from 'react';
import {View, Image} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BlogStack = ({navigation, route}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Blogs"
      component={BlogScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);
const HomeStack = ({navigation, route}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ProfProfile"
      component={ProfProfile}
      options={({route}) => ({
        title: route.params.profName + "'s Profile",
        // title: route.params.ProfName,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          // shadowColor: colors.postL,
          elevation: 0,
        },
        headerTitleStyle: {
          fontFamily: font.title,
          fontSize: 14,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <Ionicons name="chevron-back" size={25} color={colors.subtext} />
        ),
      })}
    />
    <Stack.Screen
      name="Plan"
      component={sessionPlan}
      options={({route}) => ({
        title: 'Book Session',
        // title: route.params.ProfName,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          // shadowColor: colors.postL,
          elevation: 0,
        },
        headerTitleStyle: {
          fontFamily: font.title,
          fontSize: 14,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <Ionicons name="close" size={25} color={colors.subtext} />
        ),
      })}
    />
  </Stack.Navigator>
);

const FeedStack = ({navigation, route}) => (
  <Stack.Navigator>
    <Stack.Screen
      // name="Mentlada Social"
      name=" "
      component={PostScreen}
      options={{
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerStyle: {
          shadowColor: '#fff',
          elevation: 0,
        },
        headerRight: () => (
          <View style={{marginRight: 10, marginTop: 5}}>
            <Feather.Button
              name="plus-square"
              size={25}
              backgroundColor="#fff"
              color={colors.primary}
              onPress={() => navigation.navigate('AddPost')}
            />
          </View>
        ),
        headerLeft: () => (
          <View style={{marginLeft: 10, marginTop: 5}}>
            <Image
              source={require('../assets/image/logo_s.png')}
              style={{height: 40, width: 140}}
            />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="AddPost"
      component={AddPostScreen}
      options={{
        title: 'Create post',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 16,
          fontFamily: font.title,
          margin: 15,
        },
        headerStyle: {
          backgroundColor: '#f7f3fc',
          shadowColor: colors.postL,
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{margin: 15}}>
            <Ionicons name="close" size={25} color={colors.p} />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="HomeProfile"
      component={ProfileScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
        tabBarHideOnKeyboard: true,
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color={colors.primary} />
          </View>
        ),
      }}
    />
  </Stack.Navigator>
);

const MessageStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Messages" component={MessageScreen} />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={({route}) => ({
        title: route.params.userName,
        headerBackTitleVisible: false,
      })}
    />
  </Stack.Navigator>
);

const ProfileStack = ({navigation, route}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profiles"
      component={ProfileScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        headerTitle: 'Edit Profile',
        headerBackTitleVisible: false,
        tabBarHideOnKeyboard: true,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
  </Stack.Navigator>
);

const AppStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Homes"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Homes') {
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
        name="Homes"
        component={HomeStack}
        options={({route}) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
        })}
      />
      <Tab.Screen
        name="Post"
        // component={PostScreen}
        component={FeedStack}
        options={({route}) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
        })}
      />
      <Tab.Screen
        name="Blog"
        component={BlogStack}
        options={{header: () => null}}
      />
      <Tab.Screen
        name="Message"
        component={MessageStack}
        options={({route}) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
        })}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={({route}) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
        })}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
