import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Avatar, ListItem, Icon, List} from 'react-native-elements';
import font from '../font';

import firestore from '@react-native-firebase/firestore';

const CustomProfList = ({
  enterChat,
  profEmail,
  patientEmail,
  id,
  professionalName,
  professionalAvatar,
  patientAvatar,
  patientName,
  isRequested,
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
          patientName,
          isRequested,
        )
      }
      bottomDivider>
      <Avatar
        rounded
        source={{
          uri:
            professionalAvatar ||
            'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={styles.Title}>{professionalName}</ListItem.Title>

        <ListItem.Subtitle
          style={styles.SubTitle}
          numberOfLines={1}
          ellipsizeMode="tail">
          {lastMessages?.[0]?.displayName}:
          {lastMessages?.[0]?.message || 'Need an approval first!'}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
};

export default CustomProfList;

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
