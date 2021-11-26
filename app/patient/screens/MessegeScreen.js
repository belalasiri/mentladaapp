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
  RequestStatus,
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
  const fetchUsers = async () => {
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
    fetchUsers();
    fetchPendingUsers();
    fetchapprovedUsers();
    // navigation.addListener('focus', () => setLoading(!loading));
    // }, [navigation, loading, profData]);
  }, [profData]);

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
                        <RequestStatus>{item.approved}</RequestStatus>
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
                        <RequestStatus>{item.approved}</RequestStatus>
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
  containerss: {
    flex: 1,
    backgroundColor: '#fff',

    // justifyContent: 'center',
    // padding: 20,
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // marginVertical: 20,
    paddingHorizontal: 20,
  },
  Card: {
    backgroundColor: '#F5F7F9',
    // backgroundColor: colors.w,
    width: '100%',
    // marginBottom: 20,
    marginTop: 10,
    borderRadius: 7,
  },
  ProfInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 15,
    alignItems: 'center',
    // marginLeft: 10,
  },
  ProfImg: {
    width: 50,
    height: 50,
    borderRadius: 70,
  },
  ProfInfoText: {
    marginLef: 10,
    fontSize: 12,
  },
  ProfName: {
    fontSize: 16,
    fontFamily: font.title,
  },
  ProfDes: {
    fontSize: 12,
    fontFamily: font.title,
  },
  ProfNameCont: {
    flexDirection: 'column',
    paddingLeft: 7,
    marginTop: -4,
  },
  ProfCont: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingRight: 15,
    paddingLeft: 15,
    paddingBottom: 15,
    alignItems: 'center',
    // marginLeft: 10,
  },
});
