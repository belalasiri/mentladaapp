import React, {useContext, useLayoutEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
  ImageBackground,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-elements';
import moment from 'moment';

import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import font from '../../../config/font';
import colors from '../../../config/colors';
import {COLORS, FONTS, icons} from '../../../constants';

const ProfessionalChat = ({navigation, route}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Chat',
      headerBackTitleVisible: false,
      headerTitleAlign: 'Left',
      headerTintColor: colors.empty,
      headerStyle: {
        backgroundColor: colors.subtext,
        elevation: 0,
        shadowOpacity: 0,
      },

      headerTitle: () => (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: -10,
          }}
          onPress={() =>
            navigation.navigate('HomeProfile', {
              userId: route.params.patientId,
            })
          }>
          <Avatar
            rounded
            source={{
              uri:
                route.params.patientAvatar ||
                'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
            }}
          />
          <Text
            style={{
              color: COLORS.lightpurple,
              ...FONTS.h6,
              marginLeft: 15,
              textTransform: 'uppercase',
            }}>
            {route.params.patientName}
          </Text>
        </TouchableOpacity>
      ),

      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => onCall()}>
            <Icon
              name="information-circle-outline"
              size={25}
              color={colors.empty}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const sendMessage = () => {
    firestore()
      .collection('session')
      .doc(route.params.patientEmail + route.params.profEmail)
      .collection('chats')
      .doc()
      .set({
        professionalName: route.params.professionalName,
        patientName: route.params.patientName,
        message: input,
        sendBy: auth().currentUser.email,
        displayName: auth().currentUser.displayName,
        patientEmail: route.params.patientEmail,
        ProfEmail: route.params.profEmail,
        patientAvatar: route.params.patientAvatar,
        professionalAvatar: route.params.professionalAvatar,
        timestamp: firestore.Timestamp.fromDate(new Date()),
      });
    setInput('');
  };
  const onCall = () => {
    Alert.alert('Session ID!', ` ${route.params.isRequested}`);
  };

  useLayoutEffect(() => {
    const fetcMessages = firestore()
      .collection('session')
      .doc(route.params.patientEmail + route.params.profEmail)
      .collection('chats')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot =>
        setMessages(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
            ProfEmail: doc.data().ProfEmail,
            displayName: doc.data().displayName,
            message: doc.data().message,
            patientAvatar: doc.data().patientAvatar,
            patientEmail: doc.data().patientEmail,
            patientName: doc.data().patientName,
            professionalAvatar: doc.data().professionalAvatar,
            sendBy: doc.data().sendBy,
            timestamp: doc.data().timestamp,
            patientId: doc.data().patientId,
          })),
        ),
      );
    return fetcMessages;
  }, [route]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <KeyboardAvoidingView
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={80}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <View style={styles.container}>
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  justifyContent: 'flex-end',
                  alignSelf: 'center',
                }}>
                <FlatList
                  inverted
                  initialNumToRender={7}
                  data={messages}
                  keyExtractor={item => item.id}
                  renderItem={({id, item}) =>
                    item.sendBy === auth().currentUser.email ? (
                      <View key={id} style={[styles.message, styles.patient]}>
                        <View
                          style={[styles.cloud, {backgroundColor: '#e8daf7'}]}>
                          <Text style={[styles.text, {color: 'black'}]}>
                            {item.message}
                          </Text>

                          <Text
                            style={[
                              styles.Timetext,
                              {alignSelf: 'flex-start'},
                            ]}>
                            {/* {moment(item.timestamp.toDate()).fromNow()} */}
                            {moment(item.timestamp.toDate(), 'HH:mm:ss').format(
                              'LT',
                            )}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View
                        key={id}
                        style={[styles.message, styles.professional]}>
                        <View
                          style={[styles.cloud, {backgroundColor: '#f9f9f9'}]}>
                          <Text style={[styles.text, {color: 'black'}]}>
                            {item.message}
                          </Text>
                          <Text
                            style={[styles.Timetext, {alignSelf: 'flex-end'}]}>
                            {moment(item.timestamp.toDate(), 'HH:mm:ss').format(
                              'LT',
                            )}
                          </Text>
                        </View>
                      </View>
                    )
                  }
                />

                <View style={styles.footer}>
                  {/* <Text>{route.params.patientId}</Text> */}
                  <TextInput
                    value={input}
                    multiline
                    onChangeText={text => setInput(text)}
                    onSubmitEditing={sendMessage}
                    placeholder="Type your message"
                    style={styles.textInput}
                  />
                  <TouchableOpacity
                    disabled={!input}
                    onPress={sendMessage}
                    activeOpacity={0.5}>
                    <Icon
                      name="send"
                      size={20}
                      color={!input ? COLORS.lightpurple : COLORS.primary}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfessionalChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  textInput: {
    // bottom: 0,
    // height: 40,
    // flex: 1,
    // marginRight: 15,
    // backgroundColor: '#ececec',
    // padding: 10,
    // color: 'grey',
    // borderRadius: 30,
    // paddingRight: 10,
    // lineHeight: 23,
    // paddingLeft: 10,
    // color: colors.text,
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    fontSize: 14,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    paddingLeft: 10,
    paddingTop: 8,
    marginRight: 15,
    marginHorizontal: 10,
    textAlign: 'left',
    lineHeight: 20,
    backgroundColor: COLORS.lightpurple,
    color: COLORS.secondary,
    overflow: 'hidden',
    flexWrap: 'wrap',
  },

  time: {
    paddingRight: 10,
    fontSize: 9,
    color: '#fff',
    paddingTop: 2,
  },

  message: {
    flexDirection: 'row',
    marginVertical: moderateScale(7, 2),
  },

  professional: {marginLeft: 20, paddingBottom: 5, position: 'relative'},

  patient: {
    alignSelf: 'flex-end',
    marginRight: 20,
    paddingBottom: 5,
    position: 'relative',
  },

  cloud: {
    maxWidth: moderateScale(230, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(5, 2),
    paddingBottom: moderateScale(7, 2),
    borderRadius: 7,
    marginBottom: 5,
    // marginBottom: 20,
    // maxWidth: '70%',
    position: 'relative',
  },

  text: {
    paddingTop: 3,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: font.subtitle,
  },
  Timetext: {
    paddingTop: 3,
    fontSize: 10,
    lineHeight: 12,
    alignSelf: 'flex-end',
    fontFamily: font.subtitle,
  },
});
