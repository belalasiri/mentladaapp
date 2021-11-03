import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,

        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (error) {
            alert(error);
          }
        },

        googleLogin: async () => {
          try {
            const {idToken} = await GoogleSignin.signIn();
            const googleCredential =
              auth.GoogleAuthProvider.credential(idToken);
            await auth().signInWithCredential(googleCredential);
          } catch (error) {
            alert(error);
          }
        },

        fbLogin: async () => {
          try {
            const result = await LoginManager.logInWithPermissions([
              'public_profile',
              'email',
            ]);
            if (result.isCancelled) {
              throw 'User cancelled the login process';
            }
            const data = await AccessToken.getCurrentAccessToken();
            if (!data) {
              throw 'Something went wrong obtaining access token';
            }
            const facebookCredential = auth.FacebookAuthProvider.credential(
              data.accessToken,
            );
            await auth().signInWithCredential(facebookCredential);
          } catch (error) {
            alert(error);
          }
        },

        register: async (email, password, confirmPassword) => {
          try {
            if (password != confirmPassword) {
              console.log('Not MATCHING');
              return;
            }
            await auth().createUserWithEmailAndPassword(email, password);
          } catch (error) {
            alert(error);
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (error) {
            alert(error);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
