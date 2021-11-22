import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
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
            await auth()
              .signInWithCredential(googleCredential)
              .then(() => {
                console.log('current User', auth().currentUser);
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    fname: '',
                    lname: '',
                    email: auth().currentUser.email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: null,
                  })
                  .catch(error => {
                    console.log(
                      'Something went wrong with added user to firestore: ',
                      error,
                    );
                  });
              })
              .catch(error => {
                console.log('Something went wrong with sign up: ', error);
              });
          } catch (error) {
            console.log({error});
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

            await auth()
              .signInWithCredential(facebookCredential)

              .then(() => {
                console.log('current User', auth().currentUser);
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    fname: '',
                    lname: '',
                    email: auth().currentUser.email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: null,
                  })
                  .catch(error => {
                    console.log(
                      'Something went wrong with added user to firestore: ',
                      error,
                    );
                  });
              })
              .catch(error => {
                console.log('Something went wrong with sign up: ', error);
              });
          } catch (error) {
            console.log({error});
          }
        },

        register: async (fname, lname, email, password, confirmPassword) => {
          try {
            await auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    fname: fname,
                    lname: lname,
                    email: email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: null,
                  })
                  .catch(error => {
                    console.log(
                      'Something went wrong with added user to firestore: ',
                      error,
                    );
                  });
              })
              .catch(error => {
                console.log('Something went wrong with sign up: ', error);
              });
          } catch (e) {
            console.log(e);
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
