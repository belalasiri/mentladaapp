import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../colors';

const Footer = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer}>
        <AntDesign name={'hearto'} size={22} color="grey" />
        <Text style={styles.number}>10</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <Feather name={'message-circle'} size={22} color="grey" />
        <Text style={styles.number}>2</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  number: {
    marginLeft: 5,
    textAlign: 'center',
  },
});
