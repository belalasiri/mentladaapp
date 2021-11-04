import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import colors from '../../config/colors';

import font from '../../config/font';

const PostScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mentlada Social</Text>
    </View>
  );
};

export default PostScreen;

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
