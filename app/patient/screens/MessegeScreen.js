import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import colors from '../../config/colors';
import font from '../../config/font';

const MessageScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Message Screen</Text>
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.w,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: colors.text,

    fontFamily: font.title,
  },
});
