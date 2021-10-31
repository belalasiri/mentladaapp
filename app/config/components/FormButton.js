import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

import {windowHeight} from '../../utils/Dimentions';
import colors from '../colors';
import font from '../font';

const FormButton = ({buttonTitle, ...rest}) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} {...rest}>
      <Text style={styles.buttonText}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

export default FormButton;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    paddingBottom: 3,
    width: '100%',
    height: windowHeight / 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  buttonText: {
    fontSize: 18,
    color: colors.empty,
    fontFamily: font.title,
  },
});
