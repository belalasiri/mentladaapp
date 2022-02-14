import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';

// DataBase
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../navigation/AuthProvider';

//My Imports (in this case my files)
import colors from '../../config/colors';
import font from '../../config/font';

//Libraries
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, FONTS, icons, SIZES} from '../../constants';

const Heder = ({userImage, onBacePress, onProfilePress, navigation}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        paddingTop: 30,
        alignItems: 'center',
      }}>
      {/* GoBack */}
      <TouchableOpacity
        style={{
          width: 45,
          height: 45,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onBacePress}>
        <Icon name="chevron-back" size={25} color={colors.text} />
      </TouchableOpacity>

      {/* Title */}

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{color: colors.text, fontSize: 20, fontFamily: font.title}}>
          Notification
        </Text>
      </View>

      {/* Profile */}
      <TouchableOpacity
        style={{
          width: 45,
          height: 45,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onProfilePress}>
        <Avatar rounded source={userImage} />
      </TouchableOpacity>
    </View>
  );
};

const Notification = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [ProfessionalData, setProfessionalData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(true);
  const [fetchPending, setFetchPending] = useState(false);

  const getUser = async () => {
    await firestore()
      .collection('Professional')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setProfessionalData(documentSnapshot.data());
        }
      });
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

  async function approvePaitent(item) {
    setFetchPending(true);
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
        ToastAndroid.showWithGravityAndOffset(
          'Patient Approved',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          0,
          200,
        );
      })
      .catch(e => {
        console.log(e);
      });

    if (loading) {
      setLoading(false);
    }
    setFetchPending(false);
  }

  useEffect(() => {
    getUser();
    fetchUsers();
    fetchPendingUsers();
  }, [pending, ProfessionalData]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Heder
        userImage={{
          uri: ProfessionalData
            ? ProfessionalData.userImg ||
              'https://i.ibb.co/2kR5zq0/Final-Logo.png'
            : 'https://i.ibb.co/2kR5zq0/Final-Logo.png',
        }}
        onBacePress={() => navigation.goBack()}
        onProfilePress={() => {}}
      />

      {ProfessionalData.Verified == 'Verified' ? (
        <View>
          <LinearGradient
            colors={[COLORS.lightpurple, COLORS.lightyellow]}
            start={{x: 0, y: 0.45}}
            end={{x: 0, y: 0}}
            style={{
              flexDirection: 'row',
              marginHorizontal: 15,
              marginVertical: 5,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 7,
              padding: 10,
            }}>
            <Image
              source={icons.verifiedUser}
              style={{
                width: 50,
                height: 50,
                marginLeft: 5,
                tintColor: COLORS.primary,
              }}
            />
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                marginHorizontal: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: colors.subtext,
                    fontFamily: font.title,
                  }}>
                  You account now is Verified, Thank you for being with us in
                  Mentlada
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginVertical: 2}}></View>
            </View>
          </LinearGradient>
        </View>
      ) : null}
      {pending?.[0] ? (
        <FlatList
          data={pending}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View>
              <LinearGradient
                colors={['#f7f3fc', '#fff']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 15,
                  marginVertical: 5,
                  alignItems: 'center',
                  borderRadius: 7,
                  padding: 10,
                }}>
                <Avatar
                  rounded
                  size={70}
                  source={{
                    uri: userData
                      ? item.patientAvatar ||
                        'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg'
                      : 'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    marginHorizontal: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: colors.subtext,
                        fontFamily: font.title,
                      }}>
                      {item.patientName} requested to have a counsultation with
                      you
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', marginVertical: 7}}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: colors.primary,
                        padding: 7,
                        marginRight: 3,
                        borderRadius: 7,
                      }}
                      onPress={() => approvePaitent(item)}>
                      {fetchPending ? (
                        <View
                          style={{
                            alignSelf: 'center',
                            justifyContent: 'center',
                            paddingTop: 2,
                          }}>
                          <ActivityIndicator size="small" color={colors.w} />
                        </View>
                      ) : (
                        <Text
                          style={{
                            color: colors.w,
                            textAlign: 'center',
                            fontFamily: font.subtitle,
                            fontSize: 13,
                            marginBottom: 1,
                          }}>
                          Approve
                        </Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: colors.empty,
                        padding: 7,
                        marginLeft: 3,
                        borderRadius: 7,
                      }}
                      onPress={() => {}}>
                      <Text
                        style={{
                          color: colors.subtext,
                          textAlign: 'center',
                          fontFamily: font.subtitle,
                          fontSize: 13,
                          marginBottom: 1,
                        }}>
                        Reject
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </View>
          )}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={icons.Notification}
            style={{
              height: 130,
              width: 130,
              marginBottom: 20,
            }}
          />
          <Text
            style={{
              fontSize: 18,
              ...FONTS.h4,
              color: COLORS.secondary,
            }}>
            Your Notification
          </Text>
          <View>
            <Text
              style={{
                fontSize: 13,
                ...FONTS.body5,
                color: COLORS.secondary,
                textAlign: 'center',
                width: SIZES.width - 120,
                lineHeight: 27,
              }}>
              When you are notified of something, it will appear here.
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
