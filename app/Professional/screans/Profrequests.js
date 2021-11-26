import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import font from '../../config/font';
import Icon from 'react-native-vector-icons/Ionicons';

import firestore, {firebase} from '@react-native-firebase/firestore';
import {AuthContext} from '../../navigation/AuthProvider';
import colors from '../../config/colors';
import ListCard from '../../config/components/ListCard';
import {windowWidth} from '../../utils/Dimentions';

const Profrequests = ({navigation, route}) => {
  const {user, Proflogout} = useContext(AuthContext);
  const [profData, setProfData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(true);

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

  useEffect(() => {
    getProf();
    fetchProf();
    fetchPendingUsers();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading, pending]);

  if (loading == true) {
    return (
      <View style={[styles.containerLoading, styles.horizontal]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.containerss}>
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
                style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
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
  );
};

export default Profrequests;

const styles = StyleSheet.create({
  containerss: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
