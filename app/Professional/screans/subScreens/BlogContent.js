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
import {COLORS, FONTS, icons} from '../../../constants';
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

const BlogContent = ({navigation, route}) => {
  const {user, logout} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isVerified, setVerified] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  let blogTime = (
    <Text>{moment(route.params.blogTime.toDate()).fromNow()}</Text>
  );
  const onLikePress = () => {
    firebase
      .firestore()
      .collection('Blogs')
      .doc(route.params.id)

      .update({
        likes: firebase.firestore.FieldValue.increment(1),
      })
      .collection('likes')
      .doc(firebase.auth().currentUser.uid);
  };

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
          console.log(result.data().Verified);
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

  useEffect(() => {
    checkApproval();
  }, [isVerified]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="default"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <ScrollView>
        {/* Header */}
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
              padding: 15,
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
                      {loading ? (
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
                margin: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {route.params.professionalId == auth().currentUser.uid ? (
                <TouchableOpacity onPress={() => {}}>
                  <Image
                    source={icons.Delete}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: COLORS.primary,
                    }}
                  />
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity>
                <Icon
                  name="heart-outline"
                  size={25}
                  color={colors.subtext}
                  style={{marginLeft: 10}}
                  onPress={() => Alert.alert('aaa', 'aa')}
                />
              </TouchableOpacity>
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
            <View style={styles.textPrivate}>
              <Text style={styles.color_textPrivate}>
                If someone you know needs help, Share this app with them by
              </Text>
              <TouchableOpacity onPress={myCustomShare}>
                <Text
                  style={[
                    styles.color_textPrivate,
                    {color: '#6b4f89', textDecorationLine: 'underline'},
                  ]}>
                  Clicking here.
                </Text>
              </TouchableOpacity>
              <Text style={styles.color_textPrivate}>
                If you need support now, call our Lifeline at
              </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text
                  style={[
                    styles.color_textPrivate,
                    {color: '#6b4f89', textDecorationLine: 'underline'},
                  ]}>
                  6-800-800-2021
                </Text>
              </TouchableOpacity>
              <Text style={styles.color_textPrivate}>
                {' '}
                or Choose a professional by{' '}
              </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text
                  style={[
                    styles.color_textPrivate,
                    {color: '#6b4f89', textDecorationLine: 'underline'},
                  ]}>
                  Clicking here.
                </Text>
              </TouchableOpacity>
            </View>
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
