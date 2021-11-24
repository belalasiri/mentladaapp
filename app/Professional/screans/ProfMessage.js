import React, {useState, useEffect, useContext} from 'react';
import firestore, {firebase} from '@react-native-firebase/firestore';

import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../../patient/styles/MessageStyles';

const ProfMessage = ({navigation}) => {
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Profdata, setProfdata] = useState(null);

  let profList = [];

  const fetchSessions = async () => {
    await firestore()
      .collection('sessions') 
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          profList.push({
            id: doc.id,
            patientAvatar: doc.data().patientAvatar,
            email: doc.data().email,
            patientName: doc.data().patientName,
            lname: doc.data().lname,
            approved: doc.data().approved,
            userImg: doc.data().userImg,
            // sendBy: doc.data().sendBy,
            // time: doc.data().time,
          });
        });
      })
      .catch(e => {
        console.log(e);
      });
    setProfdata(profList);

    if (loading) {
      setLoading(false);
    }
  };
  // let profList = [];

  // const fetchSessions = async () => {
  //   await firestore()
  //     .collection('Professional')
  //     .get()
  //     .then(querySnapshot => {
  //       querySnapshot.forEach(doc => {
  //         profList.push({
  //           id: doc.id,
  //           email: doc.data().email,
  //           fname: doc.data().fname,
  //           lname: doc.data().lname,
  //           userImg: doc.data().userImg,
  //           // sendBy: doc.data().sendBy,
  //           // time: doc.data().time,
  //         });
  //       });
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  //   setProfdata(profList);

  //   if (loading) {
  //     setLoading(false);
  //   }
  // };

  let messagesList = [];

  const fetchMessages = async () => {
    await firestore()
      .collection('sessions')
      .doc('patient_professional')
      .collection('chats')

      // .where(this.profEmail, '==', 'professional@gmail.com')
      // .where(Profdata.profEmail, '==', 'professional@gmail.com')
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
      })
      .catch(e => {
        console.log(e);
      });
    setMessages(messagesList);

    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchMessages();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading]);

  return (
    <Container>
      <FlatList
        data={Profdata}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Card
            onPress={() =>
              navigation.navigate('Chat', {userName: item.patientName})
            }>
            <UserInfo>
              <UserImgWrapper>
                <UserImg
                  source={{
                    uri: Profdata
                      ? item.patientAvatar ||
                        'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                      : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
                  }}
                />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <UserName>{item.patientName}</UserName>
                  {/* <PostTime>{item.messageTime}</PostTime> */}
                </UserInfoText>
                <MessageText>{item.approved}</MessageText>
                {/* <MessageText>{item.messageText}</MessageText> */}
                <Text>{item.email} </Text>
              </TextSection>
            </UserInfo>
          </Card>
        )}
      />
      {/* <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Card
            onPress={() =>
              navigation.navigate('Chat', {userName: item.userName})
            }>
            <UserInfo>
              <TextSection>
                <UserInfoText>
                  <View>
                    {item.sendBy == 'patient@gmail.com' && (
                      <UserName>{item.message}</UserName>
                    )}
                  </View>
                  <View>
                    {item.sendBy == 'professional@gmail.com' && (
                      <UserName>{item.message}</UserName>
                    )}
                  </View>
                </UserInfoText>
              </TextSection>
            </UserInfo>
          </Card>
        )}
      />  */}
    </Container>
  );
};

export default ProfMessage;

const styles = StyleSheet.create({
  senderStyle: {
    color: 'teal',
  },
 
});
