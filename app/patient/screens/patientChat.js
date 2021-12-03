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
} from 'react-native';
import {Avatar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../config/colors';
import font from '../../config/font';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {moderateScale} from 'react-native-size-matters';
import moment from 'moment';

const patientChat = ({navigation, route}) => {
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: -10,
          }}>
          <Avatar
            rounded
            source={{
              uri:
                route.params.professionalAvatar ||
                'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
            }}
          />
          <Text
            style={{
              color: colors.empty,
              fontFamily: font.title,
              marginLeft: 15,
              textTransform: 'uppercase',
            }}>
            {route.params.professionalName}
          </Text>
        </View>
      ),

      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
            <Icon name="videocam-outline" size={25} color={colors.empty} />
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
          })),
        ),
      );
    return fetcMessages;
  }, [route]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar
        barStyle="dark-content"
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
                  ListFooterComponent={() => (
                    <View style={{padding: 20, alignItems: 'center'}}>
                      <Text
                        style={{
                          fontFamily: font.subtitle,
                          color: colors.subtext,
                        }}>
                        Consultation session with{' '}
                        {route.params.professionalName}
                      </Text>
                    </View>
                  )}
                  data={messages}
                  keyExtractor={item => item.id}
                  renderItem={({id, item}) =>
                    item.sendBy === auth().currentUser.email ? (
                      <View key={id} style={[styles.Message, styles.patient]}>
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
                            {moment(item.timestamp.toDate(), 'HH:mm:ss').format(
                              'LT',
                            )}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View
                        key={id}
                        style={[styles.Message, styles.professional]}>
                        <View
                          style={[styles.cloud, {backgroundColor: '#ececec'}]}>
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
                    {input ? (
                      <Icon
                        name="send"
                        size={20}
                        color={colors.subtext}
                        style={styles.icon}
                      />
                    ) : (
                      <Icon
                        name="add"
                        size={25}
                        color={colors.subtext}
                        style={styles.icon}
                      />
                    )}
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

export default patientChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
  },
  textInput: {
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
    backgroundColor: '#ececec',
    color: colors.text,
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
    fontSize: 12,
    lineHeight: 12,
    alignSelf: 'flex-end',
    fontFamily: font.subtitle,
  },
});

{
  /* <ScrollView contentContainerStyle={{paddingTop: 15}}>
              {messages.map(({id, data}) =>
                data.sendBy === auth().currentUser.email ? (
                  <View key={id} style={styles.reciver}>
                    <Avatar
                      rounded
                      position="absolute"
                      size={25}
                      bottom={-15}
                      right={-5}
                      // for the web in case anything happend
                      containerStyle={{
                        position: 'absolute',
                        bottom: -15,
                        right: -5,
                      }}
                      source={{uri: data.patientAvatar}}
                    />
                    <Text style={styles.reciverText}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.sender}>
                    <Avatar
                      rounded
                      position="absolute"
                      size={25}
                      bottom={-15}
                      right={-5}
                      // for the web in case anything happend
                      containerStyle={{
                        position: 'absolute',
                        bottom: -15,
                        right: -5,
                      }}
                      source={{uri: data.professionalAvatar}}
                    />
                    <Text style={styles.senderText}>{data.message}</Text>
                    <Text style={styles.senderName}>{data.patientName}</Text>
                  </View>
                ),
              )}
            </ScrollView> */
}
