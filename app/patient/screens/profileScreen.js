import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ToastAndroid,
} from 'react-native';
import firestore, {firebase} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Share from 'react-native-share';
import auth from '@react-native-firebase/auth';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {AuthContext} from '../../navigation/AuthProvider';
import font from '../../config/font';
import colors from '../../config/colors';
import {Divider} from '../styles/FeedStyles';
import File from '../../assets/filesBase64';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import moment from 'moment';
import {COLORS, FONTS} from '../../constants';
import {BarIndicator} from 'react-native-indicators';
import PostContent from './subScreen/PostContent';

const ProfileScreen = ({navigation, route}) => {
  const {user, logout} = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [userData, setUserData] = useState(null);
  const [ApprovedChats, setApprovedChats] = useState([]);
  const [PendingChats, setPendingChats] = useState([]);
  const [packageData, setPackageData] = useState(0);

  const Heder = ({onBacePress, onAddPress, name}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          paddingVertical: 10,
          // marginTop: 5,
          alignItems: 'center',
        }}>
        {/* GoBack */}
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={{
              width: 45,
              height: 45,
              alignItems: 'center',
              borderRadius: 25,
              justifyContent: 'center',
              backgroundColor: COLORS.lightpurple,
            }}
            onPress={onBacePress}>
            <Icon name="chevron-back" size={25} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 15,
              fontFamily: font.title,
              textAlign: 'center',
            }}>
            {name}
          </Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center'}} />
      </View>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'profile',
      headerStyle: {elevation: 0},
      headerTitleStyle: {
        color: colors.text,
        fontFamily: font.title,
      },
      headerTitleAlign: 'center',
      headerTintColor: colors.text,
      headerLeft: () => (
        <View style={{marginLeft: 20}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.navigate('AddPost');
            }}>
            <Icon name="create-outline" size={25} color={colors.subtext} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const fetchPosts = async () => {
    try {
      const list = [];

      await firestore()
        .collection('posts')
        .where('userId', '==', route.params ? route.params.userId : user.uid)
        .orderBy('postTime', 'desc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const {userId, post, postImg, postTime, likes, comments} =
              doc.data();
            list.push({
              id: doc.id,
              userId,
              userName: 'Mentlada Patient',
              userImg: 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
              postTime: postTime,
              post,
              postImg,
              liked: false,
              likes,
              comments,
            });
          });
        });

      setPosts(list);
      if (loading) {
        setLoading(false);
      }
      // console.log('Posts: ', posts);
    } catch (e) {
      console.log(e);
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

  const handleDelete = postId => {
    Alert.alert(
      'Delete post',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => deletePost(postId),
        },
      ],
      {cancelable: false},
    );
  };

  const deletePost = postId => {
    console.log('Current Post Id: ', postId);

    firestore()
      .collection('posts')
      .doc(postId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const {postImg} = documentSnapshot.data();

          if (postImg != null) {
            const storageRef = storage().refFromURL(postImg);
            const imageRef = storage().ref(storageRef.fullPath);

            imageRef
              .delete()
              .then(() => {
                // console.log(`${postImg} has been deleted successfully.`);
                deleteFirestoreData(postId);
              })
              .catch(e => {
                console.log('Error while deleting the image. ', e);
              });
            //  If the post image is not available
          } else {
            deleteFirestoreData(postId);
          }
        }
      });
  };

  const deleteFirestoreData = postId => {
    firestore()
      .collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        ToastAndroid.showWithGravityAndOffset(
          'Your post has been deleted successfully!',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          0,
          200,
        );
        setDeleted(true);
      })
      .catch(e => console.log('Error deleting posst.', e));
  };

  const myCustomShare = async () => {
    const shareOptions = {
      message:
        "Come to Mentlada App, where you may get support with any mental health condition you are now experiencing. I've already completed several portions, and they were excellent; come my friend and give them a go.",
      url: File.image1,
      // urls: [files.image1, files.image2]
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log('Error => ', error);
    }
  };

  useEffect(() => {
    getUser();
    fetchPosts();
    setDeleted(false);

    const APPROVED = firestore()
      .collection('session')
      .where('patientEmail', '==', user.email)
      .where('approved', '==', 'approved')
      .onSnapshot(snapshot =>
        setApprovedChats(
          snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})),
        ),
      );
    const PENDING = firestore()
      .collection('session')
      .where('patientEmail', '==', user.email)
      .where('approved', '==', 'pending')
      .onSnapshot(snapshot =>
        setPendingChats(
          snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})),
        ),
      );
    return APPROVED, PENDING;
  }, [navigation, deleted, posts]);

  useLayoutEffect(() => {
    firestore()
      .collection('packages')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setPackageData(documentSnapshot.data().seconds);
          console.log(packageData);
        } else return 0;
      })
      .catch(e => {
        console.log(e);
      });
  }, [packageData]);

  if (loading == true) {
    return (
      <View style={[styles.containerLoading, styles.horizontal]}>
        <BarIndicator size={35} color={COLORS.primary} />
      </View>
    );
  }
  const formatted = moment
    .utc(packageData * 1000)
    .format('DD [d,]HH [h,]mm [m]');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#f7f3fc" /> */}

      <View style={styles.userBtnWrapper}>
        {route.params ? (
          <>
            {route.params.userId !== auth().currentUser.uid ? (
              <View style={{paddingTop: 30}} />
            ) : null}
          </>
        ) : null}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {route.params ? (
          <>
            {route.params.userId !== auth().currentUser.uid ? (
              <>
                {/* other users view */}
                <Heder
                  name={
                    userData
                      ? userData.fname + ' ' + userData.lname || 'Mentlada'
                      : 'Mentlada'
                  }
                  userImage={{
                    uri: 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
                  }}
                  onBacePress={() => navigation.goBack()}
                />
                <View style={{marginRight: 15, marginTop: 2, marginLeft: 15}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        style={styles.userImg}
                        source={{
                          uri: userData
                            ? userData.userImg ||
                              'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                            : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
                        }}
                      />

                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingTop: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={styles.userName}>
                          {userData ? userData.fname || 'Mentlada' : 'Mentlada'}{' '}
                          {userData ? userData.lname || 'Patient' : 'Patient'}
                        </Text>

                        <Text style={styles.aboutUser}>
                          {userData
                            ? userData.about || 'No details added.'
                            : ''}
                        </Text>
                      </View>
                      <View
                        style={{
                          borderBottomColor: '#ddd',
                          borderBottomWidth: 1,
                          width: '92%',
                          alignSelf: 'center',
                          marginTop: 10,
                        }}
                      />
                    </View>
                  </View>

                  <View style={{paddingHorizontal: 10, paddingVertical: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignContent: 'center',
                        paddingVertical: 15,
                      }}>
                      <Icon name="mail-outline" size={15} />

                      <Text style={styles.phone}>
                        {userData ? userData.email || 'No email added.' : ''}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignContent: 'center',
                      }}>
                      <Icon name="call-outline" size={15} />

                      <Text style={styles.phone}>
                        {userData
                          ? userData.phone || 'No phone no. added.'
                          : ''}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 15,
                        alignContent: 'center',
                      }}>
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        color="#333333"
                        size={15}
                      />

                      <Text style={styles.phone}>
                        {userData
                          ? userData.country || 'No details added.'
                          : ''}
                        {' _ '}
                        {userData ? userData.city || 'No details added.' : ''}
                      </Text>
                    </View>
                  </View>

                  {/* Tell Your Friends button */}
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      borderRadius: 7,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: 6,
                      backgroundColor: colors.w,
                      marginTop: 10,
                    }}
                    onPress={myCustomShare}>
                    <Icon
                      name="share-outline"
                      color={colors.primary}
                      size={20}
                    />
                    <Text
                      style={{
                        marginLeft: 5,
                        fontFamily: font.title,
                        color: colors.primary,
                        fontSize: 14,
                      }}>
                      Tell Your Friends about Mentlada
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    marginBottom: 10,
                    marginHorizontal: 5,
                    marginTop: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: -9,
                        marginLeft: 20,
                      }}>
                      <Icon name="apps" size={20} />
                      <Text style={styles.sPosts}>
                        {userData ? userData.fname || 'Mentlada' : 'Mentlada'}'s
                        posts
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: -9,
                        marginRight: 20,
                      }}>
                      <Text
                        style={{
                          color: COLORS.secondary,
                          ...FONTS.h4,
                          paddingHorizontal: 10,
                        }}>
                        {posts.length}
                      </Text>
                      {posts.length == 1 ? (
                        <Text style={{color: COLORS.secondary, ...FONTS.h5}}>
                          Post
                        </Text>
                      ) : (
                        <Text style={{color: COLORS.secondary, ...FONTS.h5}}>
                          Posts
                        </Text>
                      )}
                    </View>
                  </View>
                  <Divider />
                </View>
              </>
            ) : null}
          </>
        ) : (
          <>
            {/* current user view */}
            <View style={{marginRight: 15, marginTop: 2, marginLeft: 15}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1.4, alignItems: 'flex-start'}}>
                  <Image
                    style={styles.userImg}
                    source={{
                      uri: userData
                        ? userData.userImg ||
                          'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                        : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
                    }}
                  />
                </View>

                {/* posts, followers, folowing */}

                <View style={{flex: 3}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}>
                    <View style={styles.userInfoItem}>
                      <Text style={styles.userInfoTitle}>{posts.length}</Text>
                      <Text style={styles.userInfoSubTitle}>Posts</Text>
                    </View>
                    <View style={styles.userInfoItem}>
                      {packageData ? (
                        <Text
                          style={{
                            ...FONTS.h5,
                            color: COLORS.secondary,
                            marginBottom: 5,
                          }}>
                          {formatted}
                        </Text>
                      ) : (
                        <Text style={styles.userInfoTitle}>No plan</Text>
                      )}

                      <Text style={styles.userInfoSubTitle}>Mentlada Plan</Text>
                    </View>
                    <View style={styles.userInfoItem}>
                      <Text style={styles.userInfoTitle}>
                        {ApprovedChats.length}
                      </Text>
                      <Text style={styles.userInfoSubTitle}>Professionals</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={{paddingHorizontal: 10, paddingVertical: 10}}>
                <Text style={styles.userName}>
                  {userData ? userData.fname || 'Mentlada' : 'Mentlada'}{' '}
                  {userData ? userData.lname || 'Patient' : 'Patient'}
                </Text>

                <Text style={styles.aboutUser}>
                  {userData ? userData.about || 'No details added.' : ''}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'center',
                    paddingVertical: 15,
                  }}>
                  <Icon name="mail-outline" size={15} />

                  <Text style={styles.phone}>
                    {userData ? userData.email || 'No email added.' : ''}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'center',
                  }}>
                  <Icon name="call-outline" size={15} />

                  <Text style={styles.phone}>
                    {userData ? userData.phone || 'No phone no. added.' : ''}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 15,
                    alignContent: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    color="#333333"
                    size={15}
                  />

                  <Text style={styles.phone}>
                    {userData ? userData.country || 'No details added.' : ''}
                    {' _ '}
                    {userData ? userData.city || 'No details added.' : ''}
                  </Text>
                </View>
              </View>

              {/* buttons for the edit profile message and follow */}
              <View style={styles.userBtnWrapper}>
                {route.params ? (
                  <>
                    {route.params.userId !== auth().currentUser.uid
                      ? null
                      : null}
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.userBtn_E}
                      onPress={() => {
                        navigation.navigate('EditProfile');
                      }}>
                      <Text style={styles.userBtnTxt}>Edit profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.userBtn_L}
                      onPress={() => logout()}>
                      <Text style={styles.userBtnTxt}>Logout</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* Tell Your Friends button */}
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  borderRadius: 7,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 6,
                  backgroundColor: colors.w,
                }}
                onPress={myCustomShare}>
                <Icon name="share-outline" color={colors.primary} size={20} />
                <Text
                  style={{
                    marginLeft: 5,
                    fontFamily: font.title,
                    color: colors.primary,
                    fontSize: 14,
                  }}>
                  Tell Your Friends
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{marginBottom: 10, marginHorizontal: 5, marginTop: 20}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginBottom: -9,
                  marginLeft: 20,
                }}>
                <Icon name="apps" size={20} />
                <Text style={styles.Posts}>Your posts</Text>
              </View>
              <Divider />
            </View>
          </>
        )}

        {/* mapping the user post */}
        {posts?.[0] ? (
          <View style={{flex: 1}}>
            {posts.map(item => (
              <PostContent
                key={item.id}
                item={item}
                onDelete={handleDelete}
                onContainerPress={() =>
                  navigation.navigate('FullPost', {
                    userId: item.userId,
                    post: item.post,
                    postTime: item.postTime,
                    postImg: item.postImg,
                    id: item.id,
                  })
                }
              />
            ))}
          </View>
        ) : (
          <>
            {route.params ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 20,
                  marginBottom: 50,
                }}>
                <Image
                  source={require('../../assets/image/image2.png')}
                  style={{
                    height: windowHeight / 3 + 20,
                    width: windowWidth / 2 + 20,
                  }}
                />
                <View
                  style={{
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
                    {userData
                      ? userData.fname + ' ' + userData.lname || 'Mentlada'
                      : 'Mentlada'}{' '}
                    post's list
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: font.subtitle,
                      color: colors.subtext,
                      textAlign: 'center',
                      width: windowWidth - 120,
                      lineHeight: 27,
                    }}>
                    When{' '}
                    {userData
                      ? userData.fname + ' ' + userData.lname || 'Mentlada'
                      : 'Mentlada'}{' '}
                    post anything, his post will appear here.
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 20,
                  marginBottom: 50,
                }}>
                <Image
                  source={require('../../assets/image/image2.png')}
                  style={{
                    height: windowHeight / 3 + 20,
                    width: windowWidth / 2 + 20,
                  }}
                />
                <View
                  style={{
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
                    Your post list
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: font.subtitle,
                      color: colors.subtext,
                      textAlign: 'center',
                      width: windowWidth - 120,
                      lineHeight: 27,
                    }}>
                    When you post anything, your post will appear here.
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  userImg: {
    height: 100,
    width: 100,
    borderRadius: 55,
  },
  userName: {
    fontSize: 18,
    fontFamily: font.title,
    color: colors.text,
  },
  aboutUser: {
    // fontSize: 12,
    // fontWeight: '600',
    // color: '#666',
    // fontFamily: font.subtitle,
    marginTop: 10,
    ...FONTS.body5,
    textAlign: 'center',
  },
  phone: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginLeft: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  userBtn_L: {
    flex: 1,
    borderColor: '#dedede',
    backgroundColor: '#dedede3b',
    borderWidth: 1,
    borderRadius: 7,
    paddingVertical: 8,
    marginHorizontal: 2,
    marginTop: 10,
  },
  userBtn_E: {
    flex: 3,
    borderColor: '#dedede',
    borderWidth: 1,
    borderRadius: 7,
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 2,
    marginTop: 10,
  },
  UserBtn: {
    flex: 2,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 7,
    paddingVertical: 8,
    marginHorizontal: 2,
    marginTop: 10,
    width: '100%',
  },
  userBtnTxt: {
    textAlign: 'center',
    color: colors.subtext,
  },

  userInfoItem: {
    alignItems: 'center',
  },
  userInfoTitle: {
    ...FONTS.h5,
    color: COLORS.secondary,
    marginBottom: 5,
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
  },
  sPosts: {
    fontSize: 16,
    fontFamily: font.title,
    marginHorizontal: 10,
    color: colors.text,
    paddingBottom: 1,
  },
  Posts: {
    fontSize: 16,
    fontFamily: font.title,
    marginHorizontal: 10,
    color: colors.text,
    paddingBottom: 1,
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

// const onUnfollow = () => {
//   firebase
//     .firestore()
//     .collection('following')
//     .doc(auth().currentUser.uid)
//     .collection('userFollowing')
//     .doc(route.params.userId)
//     .delete({});
// };
// const onFollow = () => {
//   firebase
//     .firestore()
//     .collection('following')
//     .doc(auth().currentUser.uid)
//     .collection('userFollowing')
//     .doc(route.params.userId)
//     .set({});
// };

// const fetchUserFollowing = async () => {
//   console.log('hi baby');
//   try {
//     const followings = [];

//     await firestore()
//       .collection('Following')
//       .doc('h2aH2YRqnIPZIbwmYv87WmtY6Lo1')
//       .collection('userFollowing')
//       .onSnapshot(Snapshot => {
//         Snapshot.docs.map(doc => {
//           followings.push(doc.id);
//         });
//         let countFollowings = 0;
//         countFollowings = followings.length;
//         console.log(countFollowings);
//       });
//   } catch (e) {
//     console.log(e);
//   }
// };
