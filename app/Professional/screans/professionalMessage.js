import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  StatusBar,
  Image,
} from 'react-native';

import {Avatar} from 'react-native-elements';

import {AuthContext} from '../../navigation/AuthProvider';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import CustomPatientList from '../../config/components/CustomPatientList';
import font from '../../config/font';
import Swich from '../../config/components/Swich';
import colors from '../../config/colors';
import {windowWidth} from '../../utils/Dimentions';
import {COLORS} from '../../constants';

const professionalMessage = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [professionalData, setUProfessionalData] = useState(null);
  const [requests, setRequests] = useState(true);
  const [ApprovedChats, setApprovedChats] = useState([]);
  const [PendingChats, setPendingChats] = useState([]);

  const onSelectSwitch = value => {
    setRequests(value);
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
          <TouchableOpacity activeOpacity={0.5}>
            <Avatar
              rounded
              source={{
                uri: professionalData
                  ? professionalData.userImg ||
                    'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                  : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
              }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [professionalData]);

  useEffect(() => {
    getUser();
    const APPROVED = firestore()
      .collection('session')
      .where('profEmail', '==', user.email)
      .where('approved', '==', 'approved')
      .onSnapshot(snapshot =>
        setApprovedChats(
          snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})),
        ),
      );
    const PENDING = firestore()
      .collection('session')
      .where('profEmail', '==', user.email)
      .where('approved', '==', 'pending')

      .onSnapshot(snapshot =>
        setPendingChats(
          snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})),
        ),
      );
    return APPROVED, PENDING;
  }, [navigation]);

  const getUser = async () => {
    await firestore()
      .collection('Professional')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUProfessionalData(documentSnapshot.data());
        }
      });
  };

  const enterChat = (
    id,
    professionalName,
    professionalAvatar,
    profEmail,
    patientEmail,
    patientAvatar,
    isRequested,
    patientName,
  ) => {
    navigation.navigate('Chat', {
      id,
      professionalName,
      professionalAvatar,
      profEmail,
      patientEmail,
      patientAvatar,
      patientName,
      isRequested,
    });
  };

  const onPendingApproved = (
    id,
    professionalName,
    professionalAvatar,
    profEmail,
    patientEmail,
  ) => {
    Alert.alert(
      'Approve patient',
      'This patient has requested to start a consultation session with you? Do you accsept to be his profitional',
      [
        {
          text: 'Cancel',
          onPress: () => {
            ToastAndroid.showWithGravityAndOffset(
              'No Action has been made',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              0,
              200,
            );
          },
          style: 'cancel',
        },
        {
          text: 'Accsept',
          onPress: () => {
            firebase
              .firestore()
              .collection('session')
              .doc(patientEmail + auth().currentUser.email)
              .update({
                approved: 'approved',
              })
              .then(() => {
                ToastAndroid.showWithGravityAndOffset(
                  'The request has been approved, Thank you.',
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
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
                  },
                }) => (
                  <CustomPatientList
                    key={id}
                    id={id}
                    professionalName={professionalName}
                    professionalAvatar={professionalAvatar}
                    patientAvatar={patientAvatar}
                    profEmail={profEmail}
                    patientEmail={patientEmail}
                    patientName={patientName}
                    isRequested={isRequested}
                    enterChat={enterChat}
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
                Your patients list
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
            <ScrollView style={styles.container}>
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
                  },
                }) => (
                  <CustomPatientList
                    key={id}
                    id={id}
                    professionalName={professionalName}
                    professionalAvatar={professionalAvatar}
                    patientAvatar={patientAvatar}
                    profEmail={profEmail}
                    patientEmail={patientEmail}
                    patientName={patientName}
                    enterChat={onPendingApproved}
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
                Your pending patients list
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
                  When a patients request for a consultation sessions, they will
                  appear here until the status of the request changes.
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default professionalMessage;

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

// <View style={{flexDirection: 'row'}}>
//   <TouchableOpacity
//     style={{
//       backgroundColor: colors.primary,
//       padding: 10,
//       margin: 2,
//       borderRadius: 10,
//     }}
//     onPress={() => approvePaitent()}>
//     <Text
//       style={{
//         color: colors.w,
//         textAlign: 'center',
//         fontFamily: font.subtitle,
//         fontSize: 12,
//       }}>
//       Approve
//     </Text>
//   </TouchableOpacity>
//   <TouchableOpacity
//     style={{
//       backgroundColor: colors.thirdly,
//       padding: 10,
//       borderRadius: 10,
//       margin: 2,
//     }}
//     onPress={() => {}}>
//     <Text
//       style={{
//         color: colors.subtext,
//         textAlign: 'center',
//         fontFamily: font.subtitle,
//         fontSize: 12,
//       }}>
//       Reject
//     </Text>
//   </TouchableOpacity>
// </View>;
