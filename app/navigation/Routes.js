import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import {AuthContext} from './AuthProvider';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import Testing from '../patient/screens/Testing';
import ProfAppStack from './ProfAppStack';

const Routes = () => {
  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);
  const [role, setRole] = useState(null);
  const onAuthStateChanged = user => {
    setUser(user);
    if (user != null) {
      setRole(user.displayName);
      setInitializing(false);
    }

    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [role, user]);

  if (initializing) return null;

  return (
    <NavigationContainer>
      {role == 'patient' ? (
        <AppStack />
      ) : role == 'professional' ? (
        <ProfAppStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default Routes;
