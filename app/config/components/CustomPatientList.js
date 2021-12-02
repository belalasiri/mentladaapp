import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Avatar, ListItem, Icon, List} from 'react-native-elements';
import font from '../font';
const CustomPatientList = ({
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
        )
      }
      bottomDivider>
      <Avatar
        rounded
        source={{
          uri:
            patientAvatar || 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={styles.Title}>{patientName}</ListItem.Title>
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
