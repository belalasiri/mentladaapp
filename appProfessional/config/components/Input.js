import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {windowHeight, windowWidth} from '../../utils/Dimentions';
import colors from '../colors';
import font from '../font';

const Input = ({labelValue, placeholderText, iconType, ...rest}) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.iconStyle}>
        <AntDesign name={iconType} size={24} color="#353948" />
      </View>
      <TextInput
        value={labelValue}
        style={styles.input}
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor="#707070"
        {...rest}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    height: windowHeight / 15,
    borderColor: 'rgba(158, 150, 150, .5)',
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f3fc',
  },
  iconStyle: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: 'rgba(158, 150, 150, .5)',
    borderRightWidth: 1,
    width: 50,
  },
  input: {
    padding: 10,
    paddingBottom: 10,
    flex: 1,
    fontSize: 16,
    color: '#353948',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: font.subtitle,
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    height: windowWidth / 15,
    height: windowHeight / 15,
    fontSize: 16,
    borderRadius: 7,
    borderWidth: 1,
  },
});
