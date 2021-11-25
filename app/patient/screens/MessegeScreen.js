import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  SafeAreaView,
  ActivityIndicator,
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
} from '../styles/MessageStyles';

import colors from '../../config/colors';
import font from '../../config/font';
import Icon from 'react-native-vector-icons/Ionicons';
import Swich from '../../config/components/Swich';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {AuthContext} from '../../navigation/AuthProvider';

const Messages = [
  {
    id: '1',
    userName: 'Belal Alqadasi',
    userImg: require('../../assets/image/users/user_1.jpg'),
    messageTime: '4 mins ago',
    messageText:
      'Hey there, this is my test for a post of Mentlada app in React Native.',
  },
  {
    id: '2',
    userName: 'Amer',
    userImg: require('../../assets/image/users/user_2.jpg'),
    messageTime: '2 hours ago',
    messageText:
      'Hey there, this is my test for a post of Mentlada app in React Native.',
  },
  {
    id: '3',
    userName: 'Bari Abikr',
    userImg: require('../../assets/image/users/user_3.jpg'),
    messageTime: '1 hours ago',
    messageText:
      'Hey there, this is my test for a post of Mentlada app in React Native.',
  },
  {
    id: '4',
    userName: 'Ahmed Asiri',
    userImg: require('../../assets/image/users/user_4.jpg'),
    messageTime: '1 day ago',
    messageText:
      'Hey there, this is my test for a post of Mentlada app in React Native.',
  },
  {
    id: '5',
    userName: 'Hanan Alatas',
    userImg: require('../../assets/image/users/user_5.jpg'),
    messageTime: '2 days ago',
    messageText:
      'Hey there, this is my test for a post of Mentlada app in React Native.',
  },
];

const MessageScreen = ({navigation, route}) => {
  const {user, Proflogout} = useContext(AuthContext);
  const [profData, setProfData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(true);
  const [approved, setApproved] = useState(true);
  const [requests, setRequests] = useState(true);

  let approvedList = [];
  const fetchapprovedUsers = async () => {
    await firestore()
      .collection('session')
      .where('approved', '==', 'approved')
      .where('patientEmail', '==', user.email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          approvedList.push({
            id: doc.id,
            approved: doc.data().approved,
            isRequested: doc.data().isRequested,
            patientName: doc.data().patientName,
            patientEmail: doc.data().patientEmail,
            patientAvatar: doc.data().patientAvatar,
            professionalName: doc.data().professionalName,
            profEmail: doc.data().profEmail,
            professionalAvatar: doc.data().professionalAvatar,
          });
        });
      })
      .catch(e => {
        console.log(e);
      });
    setApproved(approvedList);

    if (loading) {
      setLoading(false);
    }
  };

  let pendingList = [];
  const fetchPendingUsers = async () => {
    await firestore()
      .collection('session')
      .where('approved', '==', 'pending')
      .where('patientEmail', '==', user.email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          pendingList.push({
            id: doc.id,
            approved: doc.data().approved,
            isRequested: doc.data().isRequested,
            patientName: doc.data().patientName,
            patientEmail: doc.data().patientEmail,
            patientAvatar: doc.data().patientAvatar,
            professionalName: doc.data().professionalName,
            profEmail: doc.data().profEmail,
            professionalAvatar: doc.data().professionalAvatar,
          });
        });
      })
      .catch(e => {
        console.log(e);
      });
    setPending(pendingList);

    if (loading) {
      setLoading(false);
    }
  };

  let userList = [];
  const fetchProf = async () => {
    await firestore()
      .collection('users')
      .orderBy('createdAt', 'desc')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // console.log(querySnapshot);
          userList.push({
            id: doc.id,
            fname: doc.data().fname,
            lname: doc.data().lname,
            email: doc.data().email,
            about: doc.data().about,
            userImg: doc.data().userImg,
            role: doc.data().role,
          });
        });
      })
      .catch(e => {
        console.log(e);
      });
    setUserData(userList);

    if (loading) {
      setLoading(false);
    }
  };

  async function approvePaitent(item) {
    await firestore()
      .collection('session')
      .doc(item.patientEmail + item.profEmail)
      .update({
        approved: 'approved',
      })
      .then(result => {
        if (loading == false) {
          setLoading(true);
        }
      })
      .catch(e => {
        console.log(e);
      });

    if (loading) {
      setLoading(false);
    }
  }

  const getProf = async () => {
    await firestore()
      .collection('Professional')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setProfData(documentSnapshot.data());
        }
      });
  };

  const onSelectSwitch = value => {
    setRequests(value);
  };

  useEffect(() => {
    getProf();
    fetchProf();
    fetchPendingUsers();
    fetchapprovedUsers();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading]);

  if (loading == true) {
    return (
      <View style={[styles.containerLoading, styles.horizontal]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Container>
      <Swich
        selectionMode={1}
        option1="approved"
        option2="pending"
        onSelectSwitch={onSelectSwitch}
      />
      <View style={{marginVertical: 20}}>
        {requests == 1 && (
          <View>
            <Text>Professional who approved your request</Text>
            <FlatList
              data={approved}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <Card
                  onPress={() =>
                    navigation.navigate('Chat', {
                      profsData: item,
                    })
                  }>
                  <UserInfo>
                    <UserImgWrapper>
                      <UserImg
                        source={{
                          uri: userData
                            ? item.professionalAvatar ||
                              'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg'
                            : 'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
                        }}
                      />
                    </UserImgWrapper>
                    <TextSection>
                      <UserInfoText>
                        <UserName>{item.professionalName}</UserName>
                        <PostTime>{item.approved}</PostTime>
                      </UserInfoText>
                      <MessageText>{item.profEmail}</MessageText>
                    </TextSection>
                  </UserInfo>
                </Card>
              )}
            />
          </View>
        )}
        {requests == 2 && (
          <View>
            <Text>Professional still pending</Text>
            <FlatList
              data={pending}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <Card
                  onPress={
                    () =>
                      Alert.alert(
                        'Wait for an approve!',
                        'the prof has not approved you yet you have to wait for a bit!',
                      )
                    // navigation.navigate('Chat', {userName: item.userName})
                  }>
                  <UserInfo>
                    <UserImgWrapper>
                      <UserImg
                        source={{
                          uri: userData
                            ? item.professionalAvatar ||
                              'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg'
                            : 'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
                        }}
                      />
                    </UserImgWrapper>
                    <TextSection>
                      <UserInfoText>
                        <UserName>{item.professionalName}</UserName>
                        <PostTime>{item.approved}</PostTime>
                      </UserInfoText>
                      <MessageText>{item.profEmail}</MessageText>
                    </TextSection>
                  </UserInfo>
                </Card>
              )}
            />
          </View>
        )}
      </View>
    </Container>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 4,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

{
  /* <TouchableOpacity
        style={{
          backgroundColor: '#ad30af',
          padding: 20,
          width: '90%',
          borderRadius: 5,
          flexDirection: 'row',
          alignItems: 'center',

          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={styles.UserImage}
            source={require('../../assets/image/gaming.png')}
          />
          <View style={{alignSelf: 'center'}}>
            <Text>Let's Begin</Text>
          </View>
          <View>
            <Text>Let's Begin</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>Let's Begin</Text>
          <Icon name="chevron-forward-outline" size={20} color="#ffde9f" />
        </View>
      </TouchableOpacity> */
}
