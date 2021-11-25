import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ProfHome from '../Professional/screans/ProfHome';
import ProfProfile from '../Professional/screans/ProfProfile';
import ProfMessage from '../Professional/screans/ProfMessage';
import ProfBlog from '../Professional/screans/ProfBlog';
import ProfChat from '../Professional/screans/subScreens/ProfChat';
import EditProfProfile from '../Professional/screans/subScreens/EditProfProfile';
import Profrequests from '../Professional/screans/Profrequests';
import font from '../config/font';
import colors from '../config/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ProfileStack = ({navigation, route}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Prof Profile"
      component={ProfProfile}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfProfile}
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
const MessageStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen name="Messages" component={ProfMessage} />
    <Stack.Screen
      name="Chat"
      component={ProfChat}
      options={({route}) => ({
        title: route.params.usersData.patientName,
        headerBackTitleVisible: false,

        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: '#ffefca',
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontSize: 16,
          fontFamily: font.title,
        },
        headerRight: () => (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{marginRight: 10, marginTop: 5}}
              onPress={() => {}}>
              <Ionicons name="videocam-outline" size={25} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{marginRight: 10, marginTop: 5, paddingLeft: 5}}
              onPress={() => {
                navigation.navigate('Messages');
              }}>
              <Ionicons
                name="log-out-outline"
                size={25}
                color={colors.subtext}
              />
            </TouchableOpacity>
          </View>
        ),
      })}
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

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            color = '#67D8AF';
          } else if (route.name === 'Requests') {
            iconName = focused ? 'people' : 'people-outline';
            color = '#b283e4';
          } else if (route.name === 'Blog') {
            iconName = focused ? 'grid' : 'grid-outline';
            color = '#b283e4';
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
        component={ProfHome}
        options={({route}) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
        })}
      />

      <Tab.Screen
        name="Requests"
        component={Profrequests}
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
