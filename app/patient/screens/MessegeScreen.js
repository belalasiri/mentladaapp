import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  Alert,
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
  MessageText,
  TextSection,
} from '../styles/MessageStyles';

import colors from '../../config/colors';
import font from '../../config/font';
import Swich from '../../config/components/Swich';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../navigation/AuthProvider';
import {Avatar} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';

const MessageScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [profData, setProfData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(true);
  const [approved, setApproved] = useState(true);
  const [requests, setRequests] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'MESSAGE',
      headerStyle: {
        backgroundColor: '#fff5df',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleStyle: {color: '#000', fontFamily: font.title},

      headerTitleAlign: 'center',

      headerLeft: () => (
        <View style={{marginLeft: 20}}>
          <TouchableOpacity activeOpacity={0.5}>
            <Avatar
              rounded
              source={{
                uri: userData
                  ? userData.userImg ||
                    'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                  : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
              }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [userData]);

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

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
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
    getUser();
    fetchPendingUsers();
    fetchapprovedUsers();
    // navigation.addListener('focus', () => setLoading(!loading));
    // }, [navigation, loading, profData]);
  }, [profData, requests]);

  if (loading == true) {
    return (
      <View style={[styles.containerLoading, styles.horizontal]}>
        <ActivityIndicator size="large" color={colors.secoundary} />
      </View>
    );
  }

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      {/* <StatusBar barStyle="dark-content" backgroundColor={colors.secoundary} /> */}

      <Swich
        selectionMode={1}
        option1="APPROVED"
        option2="PENDING"
        onSelectSwitch={onSelectSwitch}
      />

      <View style={{marginVertical: 20, paddingHorizontal: 20}}>
        {requests == 1 && (
          <View>
            <Text>APPROVED</Text>
          </View>
        )}
        {requests == 2 && (
          <View>
            <Text>PENDING</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  containerss: {
    flex: 1,
    backgroundColor: '#fff',
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
    paddingHorizontal: 20,
  },
  Card: {
    backgroundColor: '#F5F7F9',
    width: '100%',
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
{
  /* <View style={{marginVertical: 20, paddingHorizontal: 20}}>
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
      </View> */
}
