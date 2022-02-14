import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ToastAndroid,
} from 'react-native';
import colors from '../../../config/colors';
import font from '../../../config/font';
import firestore, {firebase} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

import {Avatar} from 'react-native-elements';
import {windowHeight, windowWidth} from '../../../utils/Dimentions';
import Share from 'react-native-share';
import File from '../../../assets/filesBase64';
import moment from 'moment';
import {COLORS, FONTS, icons, SIZES} from '../../../constants';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
import {AuthContext} from '../../../navigation/AuthProvider';
import DeleteBlog from '../../components/DeleteBlog';
import OnDelete from '../../components/onDelete';
import AuthorCustom from '../../components/AuthorCustom';
import LinearGradient from 'react-native-linear-gradient';

const BlogContent = ({navigation, route, onDelete}) => {
  const {user, logout} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isVerified, setVerified] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isLiked, setLiked] = useState([]);
  const [likeList, setLikeList] = useState(0);
  const [isReloading, setReloading] = useState(false);

  let blogTime = (
    <Text>{moment(route.params.blogTime.toDate()).fromNow()}</Text>
  );
  const onLikePress = () => {
    setReloading(true);

    firebase
      .firestore()
      .collection('Blogs')
      .doc(route.params.id)
      .collection('Likes')
      .doc(auth().currentUser.uid)
      .set({
        likedTime: firestore.Timestamp.fromDate(new Date()),
        likerId: auth().currentUser.uid,
        Liked: 'true',
      })
      .then(() => {
        setReloading(false);
        // console.log('Blog liked!');
      })
      .catch(error => {
        console.log('Something went wrong with liking the Blog.', error);
      });
  };
  const disLikeThePost = () => {
    setReloading(true);
    firebase
      .firestore()
      .collection('Blogs')
      .doc(route.params.id)
      .collection('Likes')
      .doc(auth().currentUser.uid)
      .delete()
      .then(() => {
        setReloading(false);
        // console.log('Blog disLiked!');
      })
      .catch(error => {
        console.log('Something went wrong with liking the post.', error);
      });
  };

  useLayoutEffect(() => {
    const getLikes = firestore()
      .collection('Blogs')
      .doc(route.params.id)
      .collection('Likes')
      .orderBy('likedTime', 'asc')
      .onSnapshot(snapshot =>
        setLikeList(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
            Liked: doc.data().Liked,
            likedTime: doc.data().likedTime,
            likerId: doc.data().likerId,
          })),
        ),
      );
    return getLikes;
  }, []);

  const myCustomShare = async () => {
    const shareOptions = {
      message:
        "Come to Mentlada App, where you may get support with any mental health condition you are now experiencing. I've already completed several portions, and they were excellent; come my friend and give them a go.",
      url: File.image2,
      // urls: [files.image1, files.image2]
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log('Error => ', error);
    }
  };

  const checkApproval = async () => {
    setUploading(true);

    await firestore()
      .collection('Professional')
      .doc(route.params.professionalId)
      .get()
      .then(result => {
        if (result.exists) {
          setVerified(result.data().Verified);
          // console.log(result.data().Verified);
          setUploading(false);
        } else {
          setVerified('notVerified');
          setUploading(false);
        }
      })
      .catch(e => {
        console.log(e);
      });
    if (loading) {
      setLoading(false);
    }
  };

  const checkLiker = async () => {
    await firestore()
      .collection('Blogs')
      .doc(route.params.id)
      .collection('Likes')
      .doc(auth().currentUser.uid)
      .get()
      .then(result => {
        if (result.exists) {
          setLiked(result.data().likerId);
          // console.log(isLiked);
        } else {
          setLiked('notLiked');
        }
      })
      .catch(e => {
        console.log(e);
      });
    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApproval();
    checkLiker();
  }, [isVerified, isLiked, likeList]);

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
          onPress: () => console.log(`Confirm Pressed! ${route.params.id}`),
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <ScrollView>
        {/* Header */}

        {/* Blog pic continer */}
        <View style={{flex: 1}}>
          <Image
            source={{
              uri:
                route.params.blogtImg ||
                'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
            }}
            resizeMode="cover"
            style={{
              width: windowWidth,
              height: windowHeight / 3 - 10,
            }}
          />
        </View>

        {/* Header nav continer */}
        <View
          style={{
            alignItems: 'center',
            position: 'absolute',
            top: 30,
            left: 20,
            right: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 25,
              backgroundColor: 'rgba(36, 26, 46, 0.3)',
            }}>
            <Icon
              name="arrow-back"
              size={22}
              color={colors.w}
              onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 5,
              paddingHorizontal: 15,
              borderRadius: 7,
              backgroundColor: 'rgba(36, 26, 46, 0.3)',
            }}>
            <Text
              style={{
                fontFamily: font.title,
                color: colors.w,
                fontSize: 15,
                lineHeight: 20,
                letterSpacing: 1,
              }}>
              {route.params.Category}
            </Text>
          </View>
        </View>

        {/* Author Continer */}
        <View style={{flex: 2}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: SIZES.padding * 2 - 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Avatar
                rounded
                size={50}
                source={{
                  uri:
                    route.params.professionalAvatar ||
                    'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
                }}
              />
              <View
                style={{
                  paddingHorizontal: 15,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.text}>Written by </Text>
                    <Text style={styles.nameText}>
                      {route.params.professionalName}
                    </Text>
                  </View>

                  {isVerified == 'notVerified' ? null : isVerified ==
                    'Verified' ? (
                    <View style={{}}>
                      {uploading ? (
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 8,
                          }}>
                          <BallIndicator color={COLORS.secondary} size={10} />
                        </View>
                      ) : (
                        <Image
                          source={icons.verifiedUser}
                          style={{
                            width: 16,
                            height: 16,
                            marginLeft: 5,
                            tintColor: COLORS.primary,
                          }}
                        />
                      )}
                    </View>
                  ) : null}
                </View>

                <Text style={styles.text}>Last updated {blogTime}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() =>
                  navigation.navigate('BlogQuestion', {
                    id: route.params.id,
                    professionalName: route.params.professionalName,
                    professionalId: route.params.professionalId,
                    professionalAvatar: route.params.professionalAvatar,
                    blogTime: route.params.blogTime,
                    Blog: route.params.Blog,
                  })
                }>
                <Image
                  source={icons.Chat}
                  style={{
                    width: 19,
                    height: 19,
                    tintColor: COLORS.secondary,
                  }}
                />
                <Text
                  style={{
                    ...FONTS.body5,
                    color: COLORS.secondary,
                  }}>
                  Ask Dr.
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingRight: 5,
                }}>
                {isLiked == 'notLiked' ? (
                  <TouchableOpacity onPress={onLikePress}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'space-around',
                      }}>
                      <TouchableOpacity
                        onPress={onLikePress}
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {isReloading ? (
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: SIZES.padding / 2,
                            }}>
                            <BallIndicator color={COLORS.secondary} size={15} />
                          </View>
                        ) : (
                          <Image
                            source={icons.clap}
                            style={{
                              width: 23,
                              height: 23,
                              tintColor: COLORS.secondary,
                            }}
                          />
                        )}
                      </TouchableOpacity>
                      <Text
                        style={{
                          ...FONTS.body4,
                          color: COLORS.secondary,
                          marginTop: -2,
                        }}>
                        {likeList.length || 0}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : isLiked == auth().currentUser.uid ? (
                  <TouchableOpacity onPress={disLikeThePost}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'space-around',
                      }}>
                      <TouchableOpacity
                        onPress={disLikeThePost}
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {isReloading ? (
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: SIZES.padding / 2,
                            }}>
                            <BallIndicator color={COLORS.secondary} size={15} />
                          </View>
                        ) : (
                          <Image
                            source={icons.clapFill}
                            style={{
                              width: 23,
                              height: 23,
                              tintColor: COLORS.primary,
                            }}
                          />
                        )}
                      </TouchableOpacity>
                      <Text
                        style={{
                          ...FONTS.body4,
                          color: COLORS.secondary,
                        }}>
                        {likeList.length || 0}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: -1,
                    }}>
                    <BarIndicator color={COLORS.secondary} size={15} />
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Blog content */}
        <View style={{flex: 2}}>
          {/* Title */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.text,
                lineHeight: 30,
                fontFamily: font.title,
                width: windowWidth / 2 + 120,
              }}>
              {route.params.Blog}
            </Text>
            <Text
              style={{
                paddingVertical: 15,
                fontSize: 14,
                color: colors.subtext,
                lineHeight: 28,
                fontFamily: font.subtitle,
              }}>
              {route.params.Content}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default BlogContent;

const styles = StyleSheet.create({
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 15,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    color: colors.subtext,
    fontFamily: font.subtitle,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContine: {
    flex: 0.45,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
