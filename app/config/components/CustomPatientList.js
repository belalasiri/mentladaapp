import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar, ListItem, Icon, List} from 'react-native-elements';
import font from '../font';

import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import colors from '../colors';
import moment from 'moment';

const CustomPatientList = ({
  enterChat,
  profEmail,
  patientEmail,
  id,
  professionalName,
  professionalAvatar,
  patientAvatar,
  isRequested,
  patientName,
  patientId,
}) => {
  const [lastMessages, setLastMessages] = useState([]);

  useEffect(() => {
    const fetcLastMessages = firestore()
      .collection('session')
      .doc(patientEmail + profEmail)
      .collection('chats')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot =>
        setLastMessages(snapshot.docs.map(doc => doc.data())),
      );
    return fetcLastMessages;
  });

  return (
    <ListItem
      key={id}
      onPress={() =>
        enterChat(
          id,
          professionalName,
          professionalAvatar,
          profEmail,
          patientEmail,
          patientAvatar,
          isRequested,
          patientName,
          patientId,
        )
      }
      bottomDivider>
      <Avatar
        rounded
        source={{
          uri: patientAvatar || 'https://i.ibb.co/2kR5zq0/Final-Logo.png',
        }}
      />
      {/*      'https://i.ibb.co/2kR5zq0/Final-Logo.png'
                            : 'https://i.ibb.co/2kR5zq0/Final-Logo.png', */}
      <ListItem.Content>
        <ListItem.Title style={styles.Title}>{patientName}</ListItem.Title>
        <ListItem.Subtitle
          style={styles.SubTitle}
          numberOfLines={1}
          ellipsizeMode="tail">
          {lastMessages?.[0]?.displayName}:
          {lastMessages?.[0]?.message || 'No messages'}
        </ListItem.Subtitle>
        {/* <Text>{patientId}</Text> */}
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
};

export default CustomPatientList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Title: {
    fontFamily: font.title,
    fontSize: 14,
  },
  SubTitle: {
    fontFamily: font.subtitle,
    fontSize: 12,
    marginTop: -5,
  },
  Status: {
    fontFamily: font.subtitle,
    fontSize: 12,
    marginTop: -5,
    alignSelf: 'flex-end',
  },
});
