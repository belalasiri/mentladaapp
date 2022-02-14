import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import colors from '../colors';
import font from '../font';

import Ionicons from 'react-native-vector-icons/Ionicons';

const MessageInput = ({
  labelValue,
  SetlabelValue,
  placeholderText,
  ...rest
}) => {
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.inputContainer}>
        <Ionicons
          name="happy-outline"
          size={25}
          color="grey"
          style={styles.icon}
        />

        <TextInput
          style={styles.input}
          placeholder={placeholderText}
          value={labelValue}
          onChangeText={SetlabelValue}
          placeholderTextColor="#707070"
          autoCorrect={true}
          {...rest}
        />
      </View>

      <Pressable style={styles.buttonContainer} {...rest}>
        {labelValue ? (
          <Ionicons name="send" size={20} color="#fff" style={styles.icon} />
        ) : (
          <Ionicons name="add" size={25} color="#fff" style={styles.icon} />
        )}
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default MessageInput;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    padding: 10,
  },
  inputContainer: {
    backgroundColor: '#f2f2f2',
    flex: 1,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#dedede',
    alignItems: 'center',
    flexDirection: 'row',
    // padding: 10,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  icon: {
    marginHorizontal: 10,
  },
  buttonContainer: {
    width: 50,
    hight: 50,
    backgroundColor: colors.primary,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 35,
  },
});

{
  /* <Ionicons
          name="camera-outline"
          size={25}
          color="grey"
          style={styles.icon}
        /> */
}
{
  /* <Ionicons
          name="mic-outline"
          size={25}
          color="grey"
          style={styles.icon}
        /> */
}
