import React from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../config/colors';
import font from '../../../config/font';
const ProfChat = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'flex-end',
          alignSelf: 'center',
        }}>
        <View style={styles.action}>
          <TextInput
            multiline
            numberOfLines={5}
            placeholder="Type your message"
            placeholderTextColor="#707070"
            autoCorrect={true}
            style={styles.textInput}
          />
          <TouchableOpacity
            style={{
              paddingRight: 15,
              alignSelf: 'center',
            }}>
            <Icon name="ios-send" color={colors.secoundary} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  action: {
    // flexDirection: 'row',
    // marginTop: 10,
    // borderColor: '#ffefca',
    // alignItems: 'center',
    // borderWidth: 2,
    // borderRadius: 7,
    // paddingLeft: 10,
    // backgroundColor: '#fff8ea',
    flexDirection: 'row',
    marginTop: 10,
    borderColor: '#ffefca',
    borderWidth: 2,
    borderRadius: 7,
    backgroundColor: '#fff8ea',
    paddingLeft: 10,
    alignContent: 'center',
  },

  textInput: {
    // flex: 1,
    // paddingLeft: 10,
    // color: colors.text,
    paddingRight: 10,
    lineHeight: 23,
    flex: 2,
    textAlignVertical: 'top',
    paddingLeft: 10,
    color: colors.text,
    height: 40,
  },
});
