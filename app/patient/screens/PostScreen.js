import React, {useContext} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../config/colors';
import FormButton from '../../config/components/FormButton';
import font from '../../config/font';
import {AuthContext} from '../../navigation/AuthProvider';
import {windowHeight} from '../../utils/Dimentions';

const PostScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Post Screen</Text>
    </View>
  );
};

export default PostScreen;

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