import React, {useState, useEffect} from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import OnboardingScreen from '../screens/OnboardingScreen';
import SignupScreen from '../patient/screens/SignupScreen';
import AppRoutes from '../patient/screens/AppRoutes';
import LoginScreen from '../patient/screens/LoginScreen';
import ProfLogin from '../Professional/screans/Auth/ProfLogin';
import ProfSignup from '../Professional/screans/Auth/ProfSignup';
import Patient_Login from '../screens/Pati_Login';
import Home from '../patient/screens/Testing';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  let routName;

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
    GoogleSignin.configure({
      webClientId:
        '55064714268-057p499ki1499poi1ptpaj18osqnieit.apps.googleusercontent.com',
    });
  }, []);

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
    routName = 'Onboarding';
  } else {
    routName = 'Routes';
  }

  return (
    <Stack.Navigator initialRouteName={routName}>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="Routes"
        component={AppRoutes}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="PatLogin"
        component={LoginScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="ProfLogin"
        component={ProfLogin}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="ProfSignup"
        component={ProfSignup}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="Patient_Login"
        component={Patient_Login}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{header: () => null}}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
