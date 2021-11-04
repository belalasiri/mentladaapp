import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import profiHomeScreen from '../professional/screens/ProfiHomeScreen';
import profiBlogScreen from '../professional/screens/ProfiBlogScreen';
import profiPostScreen from '../professional/screens/ProfiPostScreen';

const Tab = createBottomTabNavigator();

const ProfiAppStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'profiHome') {
            iconName = focused ? 'home' : 'home-outline';
            color = '#67D8AF';
            // size = 30;
          } else if (route.name === 'profiPost') {
            iconName = focused ? 'grid' : 'grid-outline';
            color = '#61EDEA';
          } else if (route.name === 'profiBlog') {
            iconName = focused ? 'reader' : 'reader-outline';
            color = '#B283E4';
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
        name="profiHome"
        component={profiHomeScreen}
        options={{header: () => null}}
      />
      <Tab.Screen
        name="profiPost"
        component={profiPostScreen}
        options={{header: () => null}}
      />
      <Tab.Screen
        name="profiBlog"
        component={profiBlogScreen}
        options={{header: () => null}}
      />
    </Tab.Navigator>
  );
};
