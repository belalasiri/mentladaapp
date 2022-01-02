import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {Avatar} from 'react-native-elements';

const ProfilePic = ({Userimage, size, onPress}) => {
  return <Avatar rounded size={size} source={Userimage} onPress={onPress} />;
};

export default ProfilePic;
