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
} from 'react-native';

import {Avatar} from 'react-native-elements';

import {AuthContext} from '../../navigation/AuthProvider';

import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import CustomPatientList from '../../config/components/CustomPatientList';
import font from '../../config/font';
import Swich from '../../config/components/Swich';

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
        backgroundColor: '#fff5df',
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
        <ScrollView style={styles.container}>
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
                enterChat={enterChat}
              />
            ),
          )}
        </ScrollView>
      )}
      {requests == 2 && (
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
