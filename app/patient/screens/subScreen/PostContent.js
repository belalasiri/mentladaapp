import React, {useContext, useEffect, useState, useLayoutEffect} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';

//Firebase
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../../navigation/AuthProvider';

// Libraries
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import {BallIndicator} from 'react-native-indicators';
// Imports
import {COLORS, FONTS, SIZES} from '../../../constants';
import {Avatar} from 'react-native-elements';
import ProgressiveImage from '../../../config/components/ProgressiveImage';
import OnPostDelete from '../../screens/subScreen/onDeletePost';

const PostContent = ({
  item,
  onDelete,
  onPress,
  onContainerPress,
  onCommentPress,
}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [CommentsList, setComments] = useState([]);
  const [isLiked, setLiked] = useState([]);
  const [likeList, setLikeList] = useState(0);
  const [isReloading, setReloading] = useState(false);

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(item.userId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };

  useLayoutEffect(() => {
    const getComments = firestore()
      .collection('posts')
      .doc(item.id)
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
      .doc(item.id)
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
    return getLikes, getComments;
  }, []);

  const onLikePress = () => {
    setReloading(true);
    firestore()
      .collection('posts')
      .doc(item.id)
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
      .doc(item.id)
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
      .doc(item.id)
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

  let UserName = (
    <Text>
      {userData ? userData.fname || 'Mentlada' : 'Mentlada'}{' '}
      {userData ? userData.lname || 'Patient' : 'Patient'}
    </Text>
  );
  let postTime = <Text>{moment(item.postTime.toDate()).fromNow()}</Text>;

  useEffect(() => {
    getUser();
    checkLiker();
    setDeleting(false);
  }, [deleting, isLiked, likeList]);
  return (
    <SafeAreaView style={styles.container}>
      <Avatar
        rounded
        size={50}
        source={{
          uri: userData
            ? userData.userImg ||
              'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg'
            : 'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
        }}
        onPress={onPress}
      />

      <View style={{flex: 1, marginHorizontal: SIZES.padding}}>
        <Pressable onPress={onContainerPress}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.UserNameAndtimeContainer}
              onPress={onPress}>
              <Text style={styles.UserName}>{UserName}</Text>
              <Text style={styles.Time}>{postTime}</Text>
            </TouchableOpacity>
            {user.uid == item.userId ? (
              <OnPostDelete
                onDeleteCus={() => onDelete(item.id)}
                IconName="delete"
              />
            ) : null}
          </View>

          <Text style={styles.Content}>{item.post}</Text>
          <TouchableOpacity
            style={{marginVertical: 10}}
            onPress={() => setDialog(true)}>
            {item.postImg != null ? (
              <ProgressiveImage
                defaultImageSource={require('../../../assets/image/default-img.jpg')}
                source={{uri: item.postImg}}
                style={{
                  height: 300,
                  width: '100%',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
                resizeMode="cover"
              />
            ) : null}
          </TouchableOpacity>

          <View style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
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
                    paddingHorizontal: SIZES.padding,
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
                  }}>
                  {likeList.length || 0}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={onCommentPress}>
              <Feather name={'message-circle'} size={22} color="grey" />
              <Text style={styles.number}>{CommentsList.length}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </View>

      <Modal visible={dialog !== false} animated animationType="slide">
        <TouchableOpacity
          onPress={() => setDialog(false)}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            backgroundColor: '#000',
            borderRadius: 7,
            marginBottom: 0,
          }}>
          <Icon name="close" color={COLORS.white} size={30} />
        </TouchableOpacity>

        <Image
          source={dialog !== false ? {uri: item.postImg} : null}
          style={styles.zoomedImage}
        />
        {/* </SafeAreaView> */}
      </Modal>
    </SafeAreaView>
  );
};

export default PostContent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.white,
  },
  zoomedImage: {
    height: SIZES.height / 1,
    width: SIZES.width / 1,
    resizeMode: 'contain',
    marginBottom: 60,
  },
  modalConiner: {
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'absolute',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  UserNameAndtimeContainer: {
    flexDirection: 'row',
  },
  UserName: {
    ...FONTS.h4_2,
    color: COLORS.secondary,
  },
  Time: {
    ...FONTS.body6,
    color: COLORS.secondary,
    marginHorizontal: 5,
    marginTop: 5,
  },
  Content: {
    ...FONTS.body4,
    color: COLORS.secondary,
    lineHeight: 22,
    marginTop: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  number: {
    marginLeft: 5,
    textAlign: 'center',
  },
});
