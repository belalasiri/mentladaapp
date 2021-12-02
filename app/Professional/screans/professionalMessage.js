import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {Avatar} from 'react-native-elements';

import {AuthContext} from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

import CustomList from '../../config/components/CustomPatientList';
import font from '../../config/font';
import colors from '../../config/colors';
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
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
              <CustomList
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
              <CustomList
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
