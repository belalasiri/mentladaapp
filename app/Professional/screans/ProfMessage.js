import React, {useState, useEffect, useContext} from 'react';

import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  RequestStatus,
  MessageText,
  TextSection,
} from '../../patient/styles/MessageStyles';

import {AuthContext} from '../../navigation/AuthProvider';
import Swich from '../../config/components/Swich';
import colors from '../../config/colors';
import font from '../../config/font';
import {windowWidth} from '../../utils/Dimentions';

import firestore, {firebase} from '@react-native-firebase/firestore';

const ProfMessage = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [profData, setProfData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(true);
  const [approved, setApproved] = useState(true);
  const [requests, setRequests] = useState(true);

  //// patients who are aproved for a session
  let approvedList = [];
  const fetchapprovedUsers = async () => {
    await firestore()
      .collection('session')
      .where('approved', '==', 'approved')
      .where('profEmail', '==', user.email)
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
      .where('profEmail', '==', user.email)
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
    <View style={styles.containerss}>
      <Swich
        selectionMode={1}
        option1="approved"
        option2="pending"
        onSelectSwitch={onSelectSwitch}
      />
      <View style={{marginVertical: 20}}>
        {requests == 1 && (
          <View style={{paddingLeft: 20, paddingRight: 20}}>
            <Text>Professional who approved your request</Text>
            <FlatList
              data={approved}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <Card
                  onPress={() =>
                    navigation.navigate('Chat', {
                      usersData: item,
                    })
                  }>
                  <UserInfo>
                    <UserImgWrapper>
                      <UserImg
                        source={{
                          uri: userData
                            ? item.patientAvatar ||
                              'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg'
                            : 'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
                        }}
                      />
                    </UserImgWrapper>
                    <TextSection>
                      <UserInfoText>
                        <UserName>{item.patientName}</UserName>
                        <RequestStatus>{item.approved}</RequestStatus>
                      </UserInfoText>
                      <MessageText>{item.patientEmail}</MessageText>
                    </TextSection>
                  </UserInfo>
                </Card>
              )}
            />
          </View>
        )}
        {requests == 2 && (
          <View style={{paddingLeft: 20, paddingRight: 20}}>
            <Text>Professional still pending</Text>
            <FlatList
              data={pending}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <Image
                        source={{
                          uri: userData
                            ? item.patientAvatar ||
                              'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg'
                            : 'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
                        }}
                        style={{
                          width: 55,
                          height: 55,
                          borderRadius: 10,
                          marginRight: 8,
                        }}
                      />
                      <View style={{width: windowWidth - 220}}>
                        <Text
                          style={{
                            color: '#333',
                            fontFamily: font.title,
                            fontSize: 14,
                            textTransform: 'uppercase',
                          }}>
                          {item.patientName}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: '#333',
                            fontFamily: font.title,
                            fontSize: 14,
                          }}>
                          {item.approved}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: colors.primary,
                          padding: 10,
                          margin: 2,
                          borderRadius: 10,
                        }}
                        onPress={() => approvePaitent(item)}>
                        <Text
                          style={{
                            color: colors.w,
                            textAlign: 'center',
                            fontFamily: font.subtitle,
                            fontSize: 12,
                          }}>
                          Approve
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          backgroundColor: colors.thirdly,
                          padding: 10,
                          borderRadius: 10,
                          margin: 2,
                        }}
                        onPress={() => {}}>
                        <Text
                          style={{
                            color: colors.subtext,
                            textAlign: 'center',
                            fontFamily: font.subtitle,
                            fontSize: 12,
                          }}>
                          Reject
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default ProfMessage;

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
