import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Avatar, ListItem, Icon, List} from 'react-native-elements';
import font from '../font';
const CustomList = ({
  enterChat,
  profEmail,
  patientEmail,
  id,
  professionalName,
  professionalAvatar,
  patientAvatar,
  patientName,
}) => {
  return (
    <ListItem
      onPress={() =>
        enterChat(
          id,
          professionalName,
          professionalAvatar,
          profEmail,
          patientEmail,
          patientAvatar,
          patientName,
        )
      }
      key={id}
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
          cacacascac
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
};

export default CustomList;

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
