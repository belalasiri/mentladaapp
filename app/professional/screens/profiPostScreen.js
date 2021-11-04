import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import colors from '../../config/colors';
import font from '../../config/font';

const profiPostScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profi Post Screen</Text>
    </View>
  );
};

export default profiPostScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: colors.text,
    fontFamily: font.title,
  },
});
