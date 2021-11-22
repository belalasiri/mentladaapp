import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import {AuthContext} from '../app/navigation/AuthProvider';
import AuthStack from '../app/navigation/AuthStack';
import AppStack from '../app/navigation/AppStack';
import Testing from '../app/patient/screens/Testing';

const Routes = () => {
  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);
  const [role, setRole] = useState(null);
  const onAuthStateChanged = user => {
    setUser(user);

    if (user != null) {
      console.log(user);
      setRole(user.displayName);
    } else {
      console.log('ere');
    }

    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      {user == 'patient' ? (
        <AppStack />
      ) : user == 'professional' ? (
        <Testing />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default Routes;
