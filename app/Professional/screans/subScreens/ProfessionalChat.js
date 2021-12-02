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
import {moderateScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-elements';

import {AuthContext} from '../../../navigation/AuthProvider';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import font from '../../../config/font';
import colors from '../../../config/colors';

const ProfessionalChat = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
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
                route.params.patientAvatar ||
                'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
            }}
          />
          <Text
            style={{
              color: colors.empty,
              fontFamily: font.title,
              marginLeft: 15,
              textTransform: 'uppercase',
            }}>
            {route.params.patientName}
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
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
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
            // data: doc.data(),
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
      <StatusBar style="Light" />
      <KeyboardAvoidingView
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={80}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <FlatList
              inverted
              data={messages}
              keyExtractor={item => item.id}
              renderItem={({id, item}) =>
                item.sendBy === auth().currentUser.email ? (
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
                      source={{uri: item.professionalAvatar}}
                    />
                    <Text style={styles.reciverText}>{item.message}</Text>
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
                      source={{uri: item.patientAvatar}}
                    />
                    <Text style={styles.senderText}>{item.message}</Text>
                    <Text style={styles.senderName}>{item.patientName}</Text>
                  </View>
                )
              }
            />
            
            <View style={styles.footer}>
              <TextInput
                value={input}
                onChangeText={text => setInput(text)}
                onSubmitEditing={sendMessage}
                placeholder="Type your message"
                style={styles.textInput}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
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
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: '#ececec',
    padding: 10,
    color: 'grey',
    borderRadius: 30,
  },
  reciver: {
    padding: 10,
    // flexDirection: 'row',
    // marginVertical: moderateScale(7, 2),
    backgroundColor: '#ececec',
    alignSelf: 'flex-end',
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: '70%',
    position: 'relative',
  },
  sender: {
    padding: 10,
    // flexDirection: 'row',
    // marginVertical: moderateScale(7, 2),
    backgroundColor: '#2b68e6',
    alignSelf: 'flex-start',
    borderRadius: 20,
    margin: 15,
    maxWidth: '80%',
    position: 'relative',
  },
  senderText: {
    fontFamily: font.title,
    color: '#fff',
    marginLeft: 10,
    marginBottom: 15,
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: '#fff',
  },
  reciverText: {
    fontFamily: font.title,
    color: colors.text,
    marginLeft: 10,
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
                      source={{uri: data.professionalAvatar}}
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
                      source={{uri: data.patientAvatar}}
                    />
                    <Text style={styles.senderText}>{data.message}</Text>
                    <Text style={styles.senderName}>{data.patientName}</Text>
                  </View>
                ),
              )}
            </ScrollView> */
}