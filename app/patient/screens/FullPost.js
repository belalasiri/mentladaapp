import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ToastAndroid,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {COLORS, FONTS, icons, SIZES} from '../../constants';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import NameContainer from './subScreen/Post/NameContainer';
import BodyContainer from './subScreen/Post/BodyContainer';
import FooterContainer from './subScreen/Post/FooterContainer';
import CustomComments from './subScreen/Post/CommentsList';
import {BallIndicator} from 'react-native-indicators';
import Icon from 'react-native-vector-icons/Ionicons';
import BlogSwitch from '../../config/components/BlogSwitch';

const FullPost = ({navigation, route}) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [CommentsList, setComments] = useState([]);
  const [commenting, setCommenting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isLiked, setLiked] = useState([]);
  const [likeList, setLikeList] = useState(0);
  const [isReloading, setReloading] = useState(false);

  const post = route.params;

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(post.userId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
    setLoading(false);
  };

  const sendComment = () => {
    setCommenting(true);
    firestore()
      .collection('posts')
      .doc(post.id)
      .collection('Comments')
      .doc()
      .set({
        Comment: input,
        CommentTime: firestore.Timestamp.fromDate(new Date()),
        CommenterId: auth().currentUser.uid,
      })
      .then(() => {
        setInput('');
        setCommenting(false);
      })
      .catch(error => {
        console.log(
          'Something went wrong with added comment to firebase.',
          error,
        );
      });
  };

  useLayoutEffect(() => {
    const getComments = firestore()
      .collection('posts')
      .doc(post.id)
      .collection('Comments')
      .orderBy('CommentTime', 'asc')
      .onSnapshot(snapshot =>
        setComments(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
            Comment: doc.data().Comment,
            CommentTime: doc.data().CommentTime,
            CommenterId: doc.data().CommenterId,
          })),
        ),
      );
    const getLikes = firestore()
      .collection('posts')
      .doc(post.id)
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

    return getComments, getLikes;
  }, []);

  const onLikePress = () => {
    setReloading(true);
    firestore()
      .collection('posts')
      .doc(post.id)
      .collection('Likes')
      .doc(auth().currentUser.uid)
      .set({
        likedTime: firestore.Timestamp.fromDate(new Date()),
        likerId: auth().currentUser.uid,
        Liked: 'true',
      })
      .then(() => {
        setReloading(false);
      })
      .catch(error => {
        console.log('Something went wrong with liking the post.', error);
      });
  };

  const disLikeThePost = () => {
    setReloading(true);
    firebase
      .firestore()
      .collection('posts')
      .doc(post.id)
      .collection('Likes')
      .doc(auth().currentUser.uid)
      .delete()
      .then(() => {
        setReloading(false);
      })
      .catch(error => {
        console.log('Something went wrong with liking the post.', error);
      });
  };

  const checkLiker = async () => {
    await firestore()
      .collection('posts')
      .doc(post.id)
      .collection('Likes')
      .doc(auth().currentUser.uid)
      .get()
      .then(result => {
        if (result.exists) {
          setLiked(result.data().likerId);
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
    getUser();
    checkLiker();
  }, [isLiked, likeList]);

  let userName = (
    <Text>
      {userData ? userData.fname || 'Mentlada' : 'Mentlada'}{' '}
      {userData ? userData.lname || 'Patient' : 'Patient'}
    </Text>
  );

  let postTime = moment(post.postTime.toDate()).fromNow();

  const onDelete = item => {
    setDeleting(true);
    firebase
      .firestore()
      .collection('posts')
      .doc(post.id)
      .collection('Comments')
      .doc(item.id)
      .delete()

      .then(() => {
        setDeleting(false);
        ToastAndroid.showWithGravityAndOffset(
          'Comment deleted successfully',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          200,
        );
      });
  };

  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingVertical: SIZES.padding * 4}}>
        <View style={{marginBottom: SIZES.padding * 4, flex: 1}}>
          <NameContainer
            userName={userName}
            userImg={{
              uri: userData
                ? userData.userImg ||
                  'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
            }}
            postTime={postTime}
            onBack={() => navigation.goBack()}
            loading={loading}
          />
          <BodyContainer
            postContent={post.post}
            conPostImage={post.postImg}
            postImage={{uri: post.postImg}}
          />
          {/* <FooterContainer
            CommentsLength={CommentsList.length}
            likeThePost={onLikePress}
            likedCount={likePost.length || 0}
          /> */}

          <View
            style={{
              paddingVertical: SIZES.padding,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: SIZES.padding * 2,
              }}>
              {isLiked == 'notLiked' ? (
                <TouchableOpacity onPress={onLikePress}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: SIZES.padding,
                    }}>
                    <TouchableOpacity onPress={onLikePress} style={{}}>
                      {isReloading ? (
                        <View
                          style={{
                            marginRight: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <BallIndicator color={COLORS.secondary} size={15} />
                        </View>
                      ) : (
                        <Icon
                          name="heart-outline"
                          size={23}
                          color={COLORS.secondary}
                        />
                      )}
                    </TouchableOpacity>
                    <Text
                      style={{
                        ...FONTS.body4,
                        color: COLORS.secondary,
                        paddingLeft: SIZES.padding / 2,
                      }}>
                      {likeList.length || 0}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : isLiked == auth().currentUser.uid ? (
                <TouchableOpacity onPress={disLikeThePost}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      paddingRight: SIZES.padding,
                    }}>
                    <TouchableOpacity onPress={disLikeThePost} style={{}}>
                      {isReloading ? (
                        <View
                          style={{
                            marginRight: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <BallIndicator color={COLORS.secondary} size={15} />
                        </View>
                      ) : (
                        <Icon name="heart" size={22} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                    <Text
                      style={{
                        ...FONTS.body4,
                        color: COLORS.secondary,
                        paddingLeft: SIZES.padding / 2,
                      }}>
                      {likeList.length || 0}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={{marginRight: 15, flexDirection: 'row'}}>
                  <BallIndicator color={COLORS.secondary} size={15} />
                  <Text
                    style={{
                      ...FONTS.body4,
                      color: COLORS.secondary,
                      paddingLeft: SIZES.padding * 2 - 5,
                      textAlign: 'center',
                    }}>
                    {likeList.length || 0}
                  </Text>
                </View>
              )}
              {/* <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 15,
                }}
                onPress={onLikePress}>
                <Image
                  source={icons.heart}
                  style={{width: 20, height: 20, tintColor: COLORS.secondary}}
                />
                <Text style={{marginLeft: 5, textAlign: 'center'}}>1</Text>
              </Pressable> */}

              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    ...FONTS.h4,
                    color: COLORS.secondary,
                    paddingHorizontal: SIZES.padding,
                  }}>
                  {CommentsList.length}
                </Text>
                <Text style={{...FONTS.body5, color: COLORS.secondary}}>
                  comments
                </Text>
              </Pressable>
            </View>
            {/* <Divider /> */}

            <View
              style={{
                borderWidth: 1,
                borderColor: COLORS.lightpurple,
                margin: SIZES.padding,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </View>

          {CommentsList?.[0] ? (
            <View style={{flex: 1}}>
              {CommentsList.map(item => (
                <CustomComments
                  key={item.id}
                  item={item}
                  onDelete={() => onDelete(item)}
                  deleting={deleting}
                />
              ))}
            </View>
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: SIZES.padding * 2 - 5,
              }}>
              <Image
                source={icons.comment}
                style={{
                  width: 80,
                  height: 80,
                }}
              />
              <Text
                style={{
                  ...FONTS.h6,
                  color: COLORS.secondary,
                  marginVertical: SIZES.padding,
                }}>
                This post has no comments
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TextInput
          value={input}
          multiline
          onChangeText={text => setInput(text)}
          placeholder="Write a comment..."
          style={styles.textInput}
        />
        <TouchableOpacity
          onPress={sendComment}
          activeOpacity={0.5}
          disabled={!input}>
          {commenting ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <BallIndicator color={COLORS.secondary} size={15} />
            </View>
          ) : (
            <Image
              source={icons.send}
              style={{
                width: 25,
                height: 25,
                tintColor: !input ? '#d9c1f2' : COLORS.primary,
              }}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FullPost;

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    paddingHorizontal: SIZES.padding * 2 - 5,
  },
  textInput: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    marginRight: 15,
    textAlign: 'left',
    backgroundColor: COLORS.lightpurple,
    color: COLORS.secondary,
    overflow: 'hidden',
    flexWrap: 'wrap',
  },
});
