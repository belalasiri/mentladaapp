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
import {COLORS, FONTS, icons, SIZES} from '../../constants';
import BlogCustom from '../components/BlogCustom';
import Feather from 'react-native-vector-icons/Feather';
import BlogSwitch from '../components/BlogSwitch';
import moment from 'moment';

const Profrequests = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [profData, setProfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingNew, setPendingNew] = useState(true);
  const [approvedList, setApprovedList] = useState(true);
  const [rejectedList, setRejectedList] = useState(true);
  const [fetchPending, setFetchPending] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [requests, setRequests] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Requests list',
      // headerTransparent: true,
      headerStyle: {elevation: 0},
      headerTitleStyle: {
        color: colors.text,
        fontFamily: font.title,
        // textTransform: 'uppercase',
      },
      headerTitleAlign: 'center',
      headerTintColor: '#000',
      headerLeft: () => (
        <View style={{marginLeft: 20}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              // navigation.openDrawer();
            }}>
            <Avatar
              rounded
              source={{
                uri: profData
                  ? profData.userImg ||
                    'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                  : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => null,
    });
  }, [profData]);

  useEffect(() => {
    getProf();
    setLoadingList(true);
    const PENDING = firestore()
      .collection('session')
      .where('profEmail', '==', user.email)
      .where('approved', '==', 'pending')
      .onSnapshot(snapshot =>
        setPendingNew(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
            approved: doc.data().approved,
            isRequested: doc.data().isRequested,
            patientName: doc.data().patientName,
            patientEmail: doc.data().patientEmail,
            patientAvatar: doc.data().patientAvatar,
            professionalName: doc.data().professionalName,
            profEmail: doc.data().profEmail,
            professionalAvatar: doc.data().professionalAvatar,
            createdAt: doc.data().createdAt,
          })),
        ),
      );
    const APPROVED = firestore()
      .collection('session')
      .where('profEmail', '==', user.email)
      .where('approved', '==', 'approved')
      .onSnapshot(snapshot =>
        setApprovedList(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
            approved: doc.data().approved,
            isRequested: doc.data().isRequested,
            patientName: doc.data().patientName,
            patientEmail: doc.data().patientEmail,
            patientAvatar: doc.data().patientAvatar,
            professionalName: doc.data().professionalName,
            profEmail: doc.data().profEmail,
            professionalAvatar: doc.data().professionalAvatar,
          })),
        ),
      );
    const REJECTED = firestore()
      .collection('session')
      .where('profEmail', '==', user.email)
      .where('approved', '==', 'rejected')
      .onSnapshot(snapshot =>
        setRejectedList(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
            approved: doc.data().approved,
            isRequested: doc.data().isRequested,
            patientName: doc.data().patientName,
            patientEmail: doc.data().patientEmail,
            patientAvatar: doc.data().patientAvatar,
            professionalName: doc.data().professionalName,
            profEmail: doc.data().profEmail,
            professionalAvatar: doc.data().professionalAvatar,
          })),
        ),
      );
    setLoadingList(false);
    return PENDING, APPROVED, REJECTED;
  }, [navigation]);

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
    setFetchPending(true);
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
    setFetchPending(false);
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
  return (
    <View style={styles.container}>
      <BlogSwitch
        selectionMode={1}
        option1="Pending"
        option2="Approved"
        option3="Rejected"
        onSelectSwitch={onSelectSwitch}
      />
      {requests == 1 && (
        <View style={{flex: 1}}>
          {pendingNew?.[0] ? (
            <FlatList
              data={pendingNew}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <View
                  style={{
                    width: windowWidth / 1 - 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
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
                        uri:
                          item.patientAvatar ||
                          'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
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
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            ...FONTS.h5,
                            color: COLORS.secondary,
                          }}>
                          {item.patientName}
                        </Text>
                        <Text
                          style={{
                            ...FONTS.body5,
                            color: COLORS.secondary,
                          }}>
                          {moment(
                            item.createdAt.toDate(),
                            'HH:mm:ss',
                          ).calendar()}
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
                          {/* onPress={() => {}}> */}
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
                marginTop: 10,
              }}>
              <Image
                source={icons.Pending}
                style={{
                  height: 170,
                  width: 170,
                  marginBottom: SIZES.padding * 2 - 5,
                }}
              />
              <Text
                style={{
                  ...FONTS.h2,
                  color: COLORS.secondary,
                  padding: 10,
                }}>
                Your pending consultation list
              </Text>
              {/* 
          <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/image/illustrationOk1.png')}
                style={{
                  height: 170,
                  width: 170,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.title,
                  color: colors.text,
                }}>
                Blog list
              </Text>
              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: font.subtitle,
                    color: colors.subtext,
                    textAlign: 'center',
                    width: windowWidth - 120,
                    lineHeight: 27,
                  }}>
                  When any professional post a Blog, The blog will appear here.
                </Text>
              </View>
            </View>
          */}
              <View>
                <Text
                  style={{
                    ...FONTS.body4,
                    color: COLORS.secondary,
                    textAlign: 'center',
                    width: windowWidth - 50,
                  }}>
                  When a consultation session request made, they will appear
                  here until the status of the request changes.
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
      {requests == 2 && (
        <View style={{flex: 1}}>
          {approvedList?.[0] ? (
            <FlatList
              data={approvedList}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <View
                  style={{
                    width: windowWidth / 1 - 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
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
                        uri:
                          item.patientAvatar ||
                          'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
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
                      <LinearGradient
                        colors={['#d1b5ef', '#b283e4', '#d1b5ef']}
                        start={{x: 1, y: 0}}
                        end={{x: 0, y: 0.25}}
                        style={{
                          marginVertical: 5,
                          alignItems: 'center',
                          borderRadius: 7,
                        }}>
                        <TouchableOpacity
                          style={{
                            padding: 7,
                            marginLeft: 5,
                          }}
                          onPress={() => rejectPaitent(item)}>
                          {/* onPress={() => {}}> */}
                          <Text
                            style={{
                              color: COLORS.white,
                              textAlign: 'center',
                              ...FONTS.h6,
                              marginBottom: 1,
                            }}>
                            Delete this patient
                          </Text>
                        </TouchableOpacity>
                      </LinearGradient>
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
                marginTop: 10,
              }}>
              <Image
                source={icons.approved}
                style={{
                  height: 170,
                  width: 170,
                  marginBottom: SIZES.padding * 2 - 5,
                }}
              />
              <Text
                style={{
                  ...FONTS.h2,
                  color: COLORS.secondary,
                  padding: 10,
                }}>
                Your approved patient list
              </Text>

              <View>
                <Text
                  style={{
                    ...FONTS.body4,
                    color: COLORS.secondary,
                    textAlign: 'center',
                    width: windowWidth - 50,
                  }}>
                  When you approved a patient for a consultation session, they
                  will appear here until the status of the request changes.
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
      {requests == 3 && (
        <View style={{flex: 1}}>
          {rejectedList?.[0] ? (
            <FlatList
              data={rejectedList}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <View
                  style={{
                    width: windowWidth / 1 - 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <LinearGradient
                    colors={[COLORS.lightpurple, '#fffcf4']}
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
                        uri:
                          item.patientAvatar ||
                          'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
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
                      <LinearGradient
                        colors={['#b3ecd7', '#67d8af', '#b3ecd7']}
                        start={{x: 0, y: 0.5}}
                        end={{x: 1, y: 0}}
                        style={{
                          flexDirection: 'row',
                          marginVertical: 5,
                          alignItems: 'center',
                          borderRadius: 7,
                        }}>
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            // backgroundColor: colors.primary,
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
                                color: COLORS.white,
                                textAlign: 'center',
                                ...FONTS.h6,
                                marginBottom: 1,
                              }}>
                              Approve
                            </Text>
                          )}
                        </TouchableOpacity>
                      </LinearGradient>
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
                marginTop: SIZES.padding,
              }}>
              <Image
                source={icons.rejected}
                style={{
                  height: 170,
                  width: 170,
                  marginBottom: SIZES.padding * 2 - 5,
                }}
              />
              <Text
                style={{
                  ...FONTS.h2,
                  color: COLORS.secondary,
                  padding: 10,
                }}>
                Your rejected patient list
              </Text>

              <View>
                <Text
                  style={{
                    ...FONTS.body4,
                    color: COLORS.secondary,
                    textAlign: 'center',
                    width: SIZES.width - 50,
                  }}>
                  When you reject a patient, they will appear here until the
                  status of the request changes.
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default Profrequests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});
