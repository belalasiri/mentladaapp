import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
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
  ToastAndroid,
  Image,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../config/colors';
import font from '../../config/font';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {moderateScale} from 'react-native-size-matters';
import moment from 'moment';
import {COLORS, icons} from '../../constants';

const patientChat = ({navigation, route}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentDate, setCurrentDate] = useState([]);
  const [packageData, setPackageData] = useState(0);

  const Heder = ({
    userImage,
    onBacePress,
    endSetion,
    onProfilePress,
    onCall,
    name,
  }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          paddingTop: 30,
          paddingBottom: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.subtext,
        }}>
        {/* GoBack */}
        {/*  */}

        <TouchableOpacity
          style={{
            width: 45,
            height: 45,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Avatar rounded source={userImage} />
        </TouchableOpacity>
        {/* Title */}
        <View
          style={{
            // flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <Text
            style={{
              color: colors.empty,
              fontFamily: font.title,
              marginLeft: 15,
              textTransform: 'uppercase',
            }}>
            {name}
          </Text>
          {route.params.isProfessionalVerified == 'notVerified' ? null : route
              .params.isProfessionalVerified == 'Verified' ? (
            <View
              style={{
                paddingTop: 3,
              }}>
              <Image
                source={icons.verifiedUser}
                style={{
                  width: 13,
                  height: 13,
                  marginLeft: 3,
                  tintColor: COLORS.primary,
                }}
              />
            </View>
          ) : null}
          {/* 
          {route.params.isProfessionalVerified}
           */}
        </View>
        {/* Profile */}

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity activeOpacity={0.5} onPress={endSetion}>
            <Icon name="exit-outline" size={25} color={colors.w} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const onCall = () => {
    Alert.alert('Patient Prof ID!', ` ${route.params.isRequested}`);
  };

  const currentDateFun = () => {
    var date = new Date();
    var seconds = date.getTime() / 1000;
    setCurrentDate(seconds);
    // console.log(currentDate);
  };

  useLayoutEffect(() => {
    firestore()
      .collection('packages')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setPackageData(documentSnapshot.data().seconds);
          // console.log(packageData);
        }
      })
      .catch(e => {
        console.log(e);
      });
  }, [packageData]);

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
  const endSetion = () => {
    navigation.navigate('Rating', {
      professionalName: route.params.professionalName,
      isRequested: route.params.isRequested,
      professionalAvatar: route.params.professionalAvatar,
      professionalName: route.params.professionalName,
      isProfessionalVerified: route.params.isProfessionalVerified,
      professionalId: route.params.professionalId,
    });

    var date = new Date();
    var seconds = date.getTime() / 1000;

    let countedSeconds = seconds - currentDate;

    //Update Time here
    //..... countedSeconds
    firebase
      .firestore()
      .collection('packages')
      .doc(auth().currentUser.uid)
      .update({
        seconds: packageData - countedSeconds,
      })

      .then(() => {
        ToastAndroid.showWithGravityAndOffset(
          `You still have \n \n ${formatted}`,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          0,
          200,
        );
      });
  };
  const formatted = moment
    .utc(packageData * 1000)
    .format('DD [Days] HH [hours] mm [minutes]:ss [seconds]');

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

  useEffect(() => {
    currentDateFun();
  }, [packageData, formatted]);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <Heder
        userImage={{
          uri:
            route.params.professionalAvatar ||
            'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
        }}
        onBacePress={() => navigation.goBack()}
        onProfilePress={() => navigation.navigate('Profile')}
        onCall={() => onCall()}
        name={route.params.professionalName}
        endSetion={endSetion}
      />
      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={80}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View
              style={{
                flex: 1,
                width: '100%',
                justifyContent: 'flex-end',
                alignSelf: 'center',
              }}>
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: font.subtitle,
                    color: colors.subtext,
                  }}>
                  Your remining plan time is:
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: font.subtitle,
                    color: colors.subtext,
                  }}>
                  {formatted}
                </Text>
              </View>

              <FlatList
                inverted
                initialNumToRender={7}
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
                          style={[styles.Timetext, {alignSelf: 'flex-start'}]}>
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
                    color={colors.subtext}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
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

  Message: {
    flexDirection: 'row',
    marginVertical: moderateScale(1, 2),
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
