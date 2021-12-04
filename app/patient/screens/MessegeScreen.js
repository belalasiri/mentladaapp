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
} from 'react-native';

import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Avatar} from 'react-native-elements';

import {AuthContext} from '../../navigation/AuthProvider';
import Swich from '../../config/components/Swich';
import font from '../../config/font';

import CustomProfList from '../../config/components/CustomProfList';
import Icon from 'react-native-vector-icons/Ionicons';

const MessageScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState(true);
  const [ApprovedChats, setApprovedChats] = useState([]);
  const [PendingChats, setPendingChats] = useState([]);
  const [loading, setLoading] = useState(true);

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
                    'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                  : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
              }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [userData]);

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
  }, [navigation]);

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
          text: 'Cancel',
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
              />
            ),
          )}
        </ScrollView>
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
