import React, {useState, useEffect, useContext} from 'react';

import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

 
 
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import colors from '../../../config/colors';
const ProfChat = ({route, navigation}) => {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState(null);
  const [loading, setLoading] = useState(true);

  
  ////Fetch All Messages
  let messagesList = [];
  const fetcMessages = async () => {
    await firestore()
      .collection('session')
      .doc(
        route.params.usersData.patientEmail + route.params.usersData.profEmail,
      )
      .collection('chats')
      .orderBy('time', 'asc')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          messagesList.push({
            id: doc.id,
            message: doc.data().message,
            sendBy: doc.data().sendBy,
            time: doc.data().time,
          });
        });
        setLoading(true);
      })
      .catch(e => {
        console.log(e);
      });
    setAllMessages(messagesList);

    if (loading) {
      setLoading(false);
    }
  };

  ///// Send Message
  async function sendMessage() {
    {
      if (message == '') {
        console.log('No Message');
      } else {
        await firestore()
          .collection('session')
          .doc(
            route.params.usersData.patientEmail +
              route.params.usersData.profEmail,
          )
          .collection('chats')
          .doc()
          .set({
            message: message,
            sendBy: route.params.usersData.profEmail,
            time: new Date().getTime(),
          })
          .then(() => {
            setMessage('');
          })
          .catch(e => {
            console.log(e);
          });
      }
    }
  }

  useEffect(() => {
    fetcMessages();
      navigation.addListener('focus', () => setLoading(!loading));
    }, [navigation, loading]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'flex-end',
          alignSelf: 'center',
        }}>
        <FlatList
          data={allMessages}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View
              style={{
                flexDirection: 'row',
                marginVertical: moderateScale(7, 2),
              }}>
              <View style={{backgroundColor: colors.primary}}>
                <Text>{item.message}</Text>
              </View>
            </View>
          )}
        />
        <View style={styles.action}>
          <TextInput
            value={message}
            onChangeText={message => setMessage(message)}
            placeholder="Type your message"
            placeholderTextColor="#707070"
            autoCorrect={true}
            style={styles.textInput}
          />
          <TouchableOpacity
            style={{
              paddingRight: 15,
              alignSelf: 'center',
            }}
            onPress={() => sendMessage()}>
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
