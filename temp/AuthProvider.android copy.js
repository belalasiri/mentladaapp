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
            // console.log('bebe')
          } catch (error) {
            alert(error);
          }
        },

        // googleLogin: async () => {
        //   try {
        //     const {idToken} = await GoogleSignin.signIn();
        //     const googleCredential =
        //       auth.GoogleAuthProvider.credential(idToken);
        //     await auth().signInWithCredential(googleCredential);
        //   } catch (error) {
        //     alert(error);
        //   }
        // },
        googleLogin: async () => {
          try {
            const {idToken} = await GoogleSignin.signIn();
            const googleCredential =
              auth.GoogleAuthProvider.credential(idToken);
            await auth()
              .signInWithCredential(googleCredential)
              // Use it only when user Sign's up,
              // so create different social signup function
              .then(() => {
                //   //Once the user creation has happened successfully, we can add the currentUser into firestore
                //   //with the appropriate details.
                console.log('current User', auth().currentUser);
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    fname: '',
                    lname: '',
                    role: 'patient',
                    email: auth().currentUser.email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: null,
                  })
                  //ensure we catch any errors at this stage to advise us if something does go wrong
                  .catch(error => {
                    console.log(
                      'Something went wrong with added user to firestore: ',
                      error,
                    );
                  });
              })
              //we need to catch the whole sign up process if it fails too.
              .catch(error => {
                console.log('Something went wrong with sign up: ', error);
              });
          } catch (error) {
            console.log({error});
          }
        },

        // fbLogin: async () => {
        //   try {
        //     const result = await LoginManager.logInWithPermissions([
        //       'public_profile',
        //       'email',
        //     ]);
        //     if (result.isCancelled) {
        //       throw 'User cancelled the login process';
        //     }
        //     const data = await AccessToken.getCurrentAccessToken();
        //     if (!data) {
        //       throw 'Something went wrong obtaining access token';
        //     }
        //     const facebookCredential = auth.FacebookAuthProvider.credential(
        //       data.accessToken,
        //     );
        //     await auth().signInWithCredential(facebookCredential);
        //   } catch (error) {
        //     alert(error);
        //   }
        // },

        fbLogin: async () => {
          try {
            // Attempt login with permissions
            const result = await LoginManager.logInWithPermissions([
              'public_profile',
              'email',
            ]);

            if (result.isCancelled) {
              throw 'User cancelled the login process';
            }

            // Once signed in, get the users AccesToken
            const data = await AccessToken.getCurrentAccessToken();

            if (!data) {
              throw 'Something went wrong obtaining access token';
            }

            // Create a Firebase credential with the AccessToken
            const facebookCredential = auth.FacebookAuthProvider.credential(
              data.accessToken,
            );

            // Sign-in the user with the credential
            await auth()
              .signInWithCredential(facebookCredential)
              // Use it only when user Sign's up,
              // so create different social signup function
              .then(() => {
                //Once the user creation has happened successfully, we can add the currentUser into firestore
                //with the appropriate details.
                console.log('current User', auth().currentUser);
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    fname: '',
                    lname: '',
                    role: 'patient',
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
              .then(result => {
                result.user.updateProfile({
                  displayName: 'patient',
                });
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    fname: fname,
                    lname: lname,
                    email: email,
                    role: 'patient',
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
        ProfRegister: async (
          fname,
          lname,
          email,
          password,
          confirmPassword,
        ) => {
          try {
            await auth()
              .createUserWithEmailAndPassword(email, password)
              .then(result => {
                result.user.updateProfile({
                  displayName: 'professional',
                });
                firestore()
                  .collection('Professional')
                  .doc(auth().currentUser.uid)
                  .set({
                    fname: fname,
                    lname: lname,
                    email: email,
                    role: 'professional',
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
 