import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  StatusBar,
  Text,
  Image,
} from 'react-native';

import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Avatar} from 'react-native-elements';

import {AuthContext} from '../../navigation/AuthProvider';
import Swich from '../../config/components/Swich';
import font from '../../config/font';

import CustomProfList from '../../config/components/CustomProfList';
import Icon from 'react-native-vector-icons/Ionicons';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import colors from '../../config/colors';
import {COLORS} from '../../constants';

const MessageScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState(true);
  const [ApprovedChats, setApprovedChats] = useState([]);
  const [PendingChats, setPendingChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [packageData, setPackageData] = useState(0);

  const onSelectSwitch = value => {
    setRequests(value);
  };

  const getPackage = async () => {
    await firestore()
      .collection('packages')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setPackageData(documentSnapshot.data().seconds);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'MESSAGE',
      headerStyle: {
        backgroundColor: COLORS.white,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleStyle: {color: '#000', fontFamily: font.title},

      headerTitleAlign: 'center',

      headerLeft: () => (
        <View style={{marginLeft: 20}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              // navigation.openDrawer();
            }}>
            <Avatar
              rounded
              source={{
                uri: userData
                  ? userData.userImg ||
                    'https://i.ibb.co/2kR5zq0/Final-Logo.png'
                  : 'https://i.ibb.co/2kR5zq0/Final-Logo.png',
              }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [userData, packageData]);

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
    getPackage();
    const APPROVED = firestore()
      .collection('session')
      .where('patientEmail', '==', user.email)
      .where('approved', '==', 'approved')
      .onSnapshot(snapshot =>
        setApprovedChats(
          snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})),
        ),
      );
    const PENDING = firestore()
      .collection('session')
      .where('patientEmail', '==', user.email)
      .where('approved', '==', 'pending')
      .onSnapshot(snapshot =>
        setPendingChats(
          snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})),
        ),
      );
    return APPROVED, PENDING;
  }, [navigation, packageData]);

  const enterChat = (
    id,
    professionalName,
    professionalAvatar,
    profEmail,
    patientEmail,
    patientAvatar,
    patientName,
    isRequested,
    professionalId,
    isProfessionalVerified,
  ) => {
    if (packageData >= 1) {
      navigation.navigate('Chat', {
        id,
        professionalName,
        professionalAvatar,
        profEmail,
        patientEmail,
        patientAvatar,
        patientName,
        isRequested,
        professionalId,
        isProfessionalVerified,
      });
    } else {
      Alert.alert(
        'You need to have a plan',
        'if you want to choose a session you may press proceed otherwise you can cancel',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed!'),
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => navigation.navigate('sessionPlan'),
          },
        ],
        {cancelable: false},
      );
    }
  };

  const onPendingDelete = (
    id,
    professionalName,
    professionalAvatar,
    profEmail,
  ) => {
    Alert.alert(
      'Cancel consultation request',
      'By confurming you are going to cancel the consultation request with the professional',
      [
        {
          text: 'Back',
          onPress: () => {
            ToastAndroid.showWithGravityAndOffset(
              'No Action has been made, Thank you',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              0,
              200,
            );
          },
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            firebase
              .firestore()
              .collection('session')
              .doc(auth().currentUser.email + profEmail)
              .delete()
              .then(() => {
                ToastAndroid.showWithGravityAndOffset(
                  'Request canceled successfully',
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  0,
                  200,
                );
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  async function deleteProf(ApprovedChats, patientEmail, profEmail) {
    await firestore()
      .collection('session')
      .doc(patientEmail + profEmail)
      .update({
        approved: 'pending',
      })
      .then(result => {
        if (loading == false) {
          setLoading(true);
        }
      })
      .catch(e => {
        console.log(e);
      });

    if (loading) {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <Swich
        selectionMode={1}
        option1="APPROVED"
        option2="PENDING"
        onSelectSwitch={onSelectSwitch}
      />

      {requests == 1 && (
        <View style={{flex: 1}}>
          {ApprovedChats?.[0] ? (
            <ScrollView>
              {ApprovedChats.map(
                ({
                  id,
                  data: {
                    professionalName,
                    professionalAvatar,
                    profEmail,
                    patientEmail,
                    patientAvatar,
                    patientName,
                    isRequested,
                    professionalId,
                    isProfessionalVerified,
                  },
                }) => (
                  <CustomProfList
                    key={id}
                    id={id}
                    professionalName={professionalName}
                    professionalAvatar={professionalAvatar}
                    patientAvatar={patientAvatar}
                    profEmail={profEmail}
                    patientEmail={patientEmail}
                    patientName={patientName}
                    enterChat={enterChat}
                    professionalId={professionalId}
                    isRequested={isRequested}
                    isProfessionalVerified={isProfessionalVerified}
                    deleteProf={() =>
                      deleteProf(ApprovedChats, patientEmail, profEmail)
                    }
                  />
                ),
              )}
            </ScrollView>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/image/illustrationOk1.png')}
                style={{
                  height: 170,
                  width: 170,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.title,
                  color: colors.text,
                }}>
                Your professionals list
              </Text>
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: font.subtitle,
                    color: colors.subtext,
                    textAlign: 'center',
                    width: windowWidth - 50,
                    lineHeight: 27,
                  }}>
                  When any professional approved your request for a
                  consultation, they will appear here.
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
      {requests == 2 && (
        <View style={{flex: 1}}>
          {PendingChats?.[0] ? (
            <ScrollView>
              {PendingChats.map(
                ({
                  id,
                  data: {
                    professionalName,
                    professionalAvatar,
                    profEmail,
                    patientEmail,
                    patientAvatar,
                    patientName,
                    isRequested,
                    professionalId,
                    isProfessionalVerified,
                  },
                }) => (
                  <CustomProfList
                    key={id}
                    id={id}
                    professionalName={professionalName}
                    professionalAvatar={professionalAvatar}
                    patientAvatar={patientAvatar}
                    profEmail={profEmail}
                    patientEmail={patientEmail}
                    patientName={patientName}
                    enterChat={onPendingDelete}
                    isRequested={isRequested}
                    professionalId={professionalId}
                    isProfessionalVerified={isProfessionalVerified}
                  />
                ),
              )}
            </ScrollView>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/image/illustrationOk1.png')}
                style={{
                  height: 170,
                  width: 170,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.title,
                  color: colors.text,
                }}>
                Your pending professionals list
              </Text>
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: font.subtitle,
                    color: colors.subtext,
                    textAlign: 'center',
                    width: windowWidth - 50,
                    lineHeight: 27,
                  }}>
                  When you request a professional consultation, they will appear
                  here until the status of the request changes.
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {height: '100%'},
  containerss: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
