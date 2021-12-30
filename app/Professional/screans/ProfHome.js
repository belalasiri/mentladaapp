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

import firestore, {firebase} from '@react-native-firebase/firestore';
import {AuthContext} from '../../navigation/AuthProvider';

import font from '../../config/font';
import colors from '../../config/colors';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import Header from '../../config/components/Home/Header';
import Spacer from '../../config/components/Home/Spacer';
import {Avatar, ListItem} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('screen');
const cardWidth = width / 1.6;
const footerWidth = width;
const Categories = [
  {
    id: 1,
    name: 'GENERAL',
    source: require('../../assets/image/Blog/NEW/General.png'),
  },
  {
    id: 2,
    name: 'BIPOLAR DISORDER',
    source: require('../../assets/image/Blog/NEW/Biolar_Disorder.png'),
  },
  {
    id: 3,
    name: 'STRESS',
    source: require('../../assets/image/Blog/NEW/STRESS.png'),
  },
  {
    id: 4,
    name: 'DEMENTIA',
    source: require('../../assets/image/Blog/NEW/DEMENTIA.png'),
  },
  {
    id: 5,
    name: 'INSOMNIA',
    source: require('../../assets/image/Blog/NEW/INSOMNIA.png'),
  },
  {
    id: 6,
    name: 'ANXIETY',
    source: require('../../assets/image/Blog/NEW/ANXIETY.png'),
  },
  {
    id: 7,
    name: 'SCHIZOPHRENIA',
    source: require('../../assets/image/Blog/NEW/SCHIZOPHRENIA.png'),
  },
];

const Card = ({Categories}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', Categories)}
      style={styles.boxContainer}
      activeOpacity={0.8}>
      <LinearGradient
        colors={['#f0e6fa', '#fff', '#f7f3fc']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={styles.boxGred}>
        <Image
          source={Categories.source}
          style={{width: '100%', height: '80%', resizeMode: 'contain'}}
        />

        <View style={styles.cardDetails}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.Title}>{Categories.name}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const ProfHome = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [profData, setProfData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(true);
  const [pendingNew, setPendingNew] = useState(true);
  const [fetchPending, setFetchPending] = useState(false);
  const [allPosts, setAllPost] = useState(null);

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
    fetchPendingUsers();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, pending]);

  useLayoutEffect(() => {
    const fetcBlogs = firestore()
      .collection('Blogs')
      .orderBy('blogTime', 'desc')
      .onSnapshot(snapshot =>
        setAllPost(
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
                          onPress={() => {}}>
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
            data={allPosts}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({id, item}) => (
              <ListItem
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
                }>
                {/* 
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
              */}
                <View
                  style={{
                    width: windowWidth / 1 - 40,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <LinearGradient
                    colors={['#f0e6fa', '#fff', '#f7f3fc']}
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 0}}
                    style={{
                      flexDirection: 'row',
                      borderRadius: 7,
                    }}>
                    <View style={{width: 100}}>
                      <Image
                        source={{
                          uri:
                            item.blogtImg ||
                            'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
                        }}
                        style={{
                          width: 100,
                          height: 150,
                          borderTopLeftRadius: 7,
                          borderBottomLeftRadius: 7,
                        }}
                      />
                    </View>
                    <ListItem.Content
                      style={{
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        marginLeft: 20,
                        paddingRight: 3,
                        paddingVertical: 10,
                      }}>
                      <ListItem.Title
                        style={{
                          fontSize: 15,
                          color: colors.text,
                          fontFamily: font.title,
                        }}>
                        {item.Blog}
                      </ListItem.Title>
                      <ListItem.Subtitle
                        style={{
                          fontSize: 13,
                          color: colors.subtext,
                          fontFamily: font.subtitle,
                          paddingRight: 5,
                          paddingVertical: 7,
                        }}
                        numberOfLines={3}
                        ellipsizeMode="tail">
                        {item.Content}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </LinearGradient>
                </View>
              </ListItem>
            )}
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
});
