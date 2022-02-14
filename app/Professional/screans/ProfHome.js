import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Animated,
  ActivityIndicator,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../navigation/AuthProvider';

import font from '../../config/font';
import colors from '../../config/colors';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import Header from '../../config/components/Home/Header';
import Spacer from '../../config/components/Home/Spacer';
import {Avatar, ListItem} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, FONTS} from '../../constants';
import BlogCustom from '../components/BlogCustom';
import {BallIndicator} from 'react-native-indicators';
import Icon from 'react-native-vector-icons/Ionicons';
const {width} = Dimensions.get('screen');

const ProfHome = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [profData, setProfData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingReject, setloadingReject] = useState(false);
  const [pending, setPending] = useState(true);
  const [pendingNew, setPendingNew] = useState(true);
  const [fetchPending, setFetchPending] = useState(false);
  const [allBlogs, setAllBlogs] = useState(null);
  const [titleHeader, setTitleHeader] = useState('Loading..');

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
            patientId: doc.data().patientId,
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

  useEffect(() => {
    const PENDING = firestore()
      .collection('session')
      .where('profEmail', '==', user.email)
      .where('approved', '==', 'pending')
      .onSnapshot(snapshot =>
        setPendingNew(
          snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})),
        ),
      );
    return PENDING;
  }, [navigation]);

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
      })
      .catch(e => {
        console.log(e);
      });

    if (loading) {
      setLoading(false);
    }
    setFetchPending(false);
  }

  async function rejectPaitent(item) {
    setloadingReject(true);
    await firestore()
      .collection('session')
      .doc(item.patientEmail + item.profEmail)
      .update({
        approved: 'rejected',
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
    setloadingReject(false);
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
    fetchUsers();
    checkProfits();

    fetchPendingUsers();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, pending]);

  const checkProfits = async () => {
    await firestore()
      .collection('Header')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          setTitleHeader(doc.data().HeaderText);
        });
      });
  };

  useLayoutEffect(() => {
    const fetcBlogs = firestore()
      .collection('Blogs')
      .orderBy('blogTime', 'desc')
      .onSnapshot(snapshot =>
        setAllBlogs(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
            professionalId: doc.data().professionalId,
            professionalAvatar: doc.data().professionalAvatar,
            professionalName: doc.data().professionalName,
            Blog: doc.data().Blog,
            Content: doc.data().Content,
            blogtImg: doc.data().blogtImg,
            Category: doc.data().Category,
            blogTime: doc.data().blogTime,
          })),
        ),
      );

    return fetcBlogs;
  }, [navigation]);

  return (
    <SafeAreaView
      style={{
        paddingTop: 10,
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header
          UserName={[
            profData ? profData.fname || 'Mentlada' : 'Mentlada',
            ' ',
            profData ? profData.lname || 'Professional' : 'Professional',
          ]}
          Userimage={{
            uri: profData
              ? profData.userImg ||
                'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg'
              : 'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
          }}
          onNotificationPress={() => navigation.navigate('Notification')}
        />
        <Spacer size={10} />

        <LinearGradient
          colors={['#f7f3fc', '#fff']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={{
            marginHorizontal: 15,
            paddingHorizontal: 15,
            marginVertical: 5,
            paddingVertical: 20,
            borderRadius: 7,
            padding: 10,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="trophy-outline" size={35} color={COLORS.secondary} />
            <View
              style={{
                flex: 1,
                alignItems: 'flex-start',
                justifyContent: 'center',
                marginHorizontal: 20,
              }}>
              <View>
                <Text
                  style={{
                    color: COLORS.secondary,
                    ...FONTS.h5,
                    lineHeight: 25,
                  }}>
                  {titleHeader}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Prof List */}
        {/* Title */}
        {pendingNew?.[0] ? (
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                alignItems: 'center',
                paddingTop: 10,
              }}>
              <Text
                style={{
                  fontFamily: font.title,
                  color: colors.text,
                  fontSize: 16,
                }}>
                Session requests
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Requests')}>
                <Text
                  style={{
                    fontFamily: font.title,
                    color: colors.primary,
                    fontSize: 12,
                  }}>
                  See all
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              data={pending}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    width: windowWidth / 1 - 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() =>
                    navigation.navigate('HomeProfile', {userId: item.patientId})
                  }>
                  <LinearGradient
                    colors={[colors.w, '#fffcf4']}
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
                        marginLeft: 15,
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
                          {item.patientName}
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row', marginVertical: 10}}>
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
                              <ActivityIndicator
                                size="small"
                                color={colors.w}
                              />
                            </View>
                          ) : (
                            <Text
                              style={{
                                color: colors.w,
                                textAlign: 'center',
                                fontFamily: font.title,
                                fontSize: 14,
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
                            marginLeft: 5,
                            borderRadius: 7,
                          }}
                          onPress={() => rejectPaitent(item)}>
                          {loadingReject ? (
                            <View
                              style={{
                                alignSelf: 'center',
                                justifyContent: 'center',
                                // paddingTop: 2,
                                flex: 1,
                              }}>
                              <BallIndicator size={13} />
                            </View>
                          ) : (
                            <Text
                              style={{
                                color: colors.subtext,
                                textAlign: 'center',
                                fontFamily: font.subtitle,
                                fontSize: 14,
                                marginBottom: 1,
                              }}>
                              Reject
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: font.title,
                color: colors.text,
              }}>
              Your pending consultation list
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: font.subtitle,
                  color: colors.subtext,
                  textAlign: 'center',
                  width: windowWidth - 50,
                  lineHeight: 27,
                }}>
                When a consultation session request made, they will appear here
                until the status of the request changes.
              </Text>
            </View>
          </View>
        )}
        <Spacer size={20} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            alignItems: 'center',
            paddingTop: 10,
          }}>
          <Text
            style={{
              fontFamily: font.title,
              color: colors.text,
              fontSize: 16,
            }}>
            Most recent blog
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Blog')}>
            <Text
              style={{
                fontFamily: font.title,
                color: colors.primary,
                fontSize: 12,
              }}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{flex: 1}}>
          <FlatList
            horizontal
            data={allBlogs}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({id, item}) =>
              item.professionalId === auth().currentUser.uid ? null : (
                <BlogCustom
                  item={item}
                  onPress={() =>
                    navigation.navigate('BlogContent', {
                      id: item.id,
                      data: item.data,
                      Blog: item.Blog,
                      Content: item.Content,
                      blogtImg: item.blogtImg,
                      professionalAvatar: item.professionalAvatar,
                      professionalName: item.professionalName,
                      Category: item.Category,
                      blogTime: item.blogTime,
                      professionalId: item.professionalId,
                    })
                  }
                  // onDelete={handleDelete}
                />
              )
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfHome;

const styles = StyleSheet.create({
  container: {
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
  text: {
    fontFamily: font.subtitle,
    color: colors.subtext,
    fontSize: 13,
    lineHeight: 20,
  },
  nameText: {
    fontFamily: font.title,
    color: colors.text,
    fontSize: 13,
    lineHeight: 20,
  },
});
