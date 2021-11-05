import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
//
import {
  InputField,
  InputWrapper,
  AddImage,
  SubmitBtn,
  SubmitBtnText,
  StatusWrapper,
} from '../styles/AddPost';
import {AuthContext} from '../../navigation/AuthProvider';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../config/colors';

const AddPostScreen = ({navigation}) => {
  return (
    <View style={styles.Container}>
      <InputWrapper>
        <InputField
          placeholder="What's on your mind?"
          multiline
          numberOfLines={4}
        />
      </InputWrapper>
      <ActionButton buttonColor={colors.post}>
        <ActionButton.Item
          buttonColor={colors.primary}
          title="Take Photo"
          onPress={() => {}}>
          <Icon name="camera-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor={colors.subtext}
          title="Choose Photo"
          onPress={() => {}}>
          <Icon name="md-images-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </View>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
