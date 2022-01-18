import React, {useContext, useEffect, useState, useLayoutEffect} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../navigation/AuthProvider';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import ProfilePic from './Feed/ProfilePic';
import MainContainer from './Feed/MainContainer';
import {COLORS} from '../../constants';

const CustomPost = ({
  item,
  onDelete,
  onPress,
  onContainerPress,
  onCommentPress,
}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [likedData, setLikedData] = useState([]);
  const [likerList, setLikerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [CommentsList, setComments] = useState([]);
  const [likeList, setLikeList] = useState([]);

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

  useEffect(() => {
    getLikedData();
    // getLikerList();
    getUser();
  }, []);

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
    return getComments;
  }, []);

  useLayoutEffect(() => {
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
    return getLikes;
  }, []);

  const likeThePost = () => {
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
      .catch(error => {
        console.log('Something went wrong with liking the post.', error);
      });
  };
  const disLikeThePost = () => {
    firestore()
      .collection('posts')
      .doc(item.id)
      .collection('Likes')
      .doc(auth().currentUser.uid)
      .delete()
      .catch(error => {
        console.log('Something went wrong with liking the post.', error);
      })
      .catch(error => {
        console.log('Something went wrong with liking the post.', error);
      });
  };

  const getLikedData = async () => {
    await firestore()
      .collection('posts')
      .doc(item.id)
      .collection('Likes')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setLikedData(documentSnapshot.data());
        }
      });
    setLoading(false);
  };

  let UserName = (
    <Text>
      {userData ? userData.fniame || 'Mentlada' : 'Mentlada'}{' '}
      {userData ? userData.lname || 'Patient' : 'Patient'}
    </Text>
  );
  let postTime = <Text>{moment(item.postTime.toDate()).fromNow()}</Text>;
  let PostContent = <Text>{item.post}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <ProfilePic
        size={50}
        Userimage={{
          uri: userData
            ? userData.userImg ||
              'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg'
            : 'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
        }}
        onPress={onPress}
      />

      {/* <Text>{auth().currentUser.uid}</Text> */}
      {/* {likedData.likerId === auth().currentUser.uid ? (
        <Text>
          sss {'           '}
          {auth().currentUser.uid}
        </Text>
      ) : (
        <Text>
          aock {'           '}
          {auth().currentUser.uid}
        </Text>
      )} */}
      <MainContainer
        Name={UserName}
        postTime={postTime}
        IconName="delete"
        PostContent={PostContent}
        conPostImage={item.postImg}
        postImage={{uri: item.postImg}}
        userUid={user.uid}
        itemuserId={item.userId}
        onPress={onPress}
        onDelete={() => onDelete(item.id)}
        onImagePress={() => setDialog(true)}
        onContainerPress={onContainerPress}
        onCommentPress={onContainerPress}
        CommentsLength={CommentsList.length}
        likeList={likeList.length}
        likeThePost={likeThePost}
        disLikeThePost={disLikeThePost}
        itemID={item.id}
      />

      <Modal visible={dialog !== false} animated animationType="slide">
        {/* <SafeAreaView
          style={{
            backgroundColor: '#fff',
            justifyContent: 'center',
            flex: 1,
            alignSelf: 'center',
          }}> */}
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

export default CustomPost;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.white,
  },
  zoomedImage: {
    height: windowHeight / 1,
    width: windowWidth / 1,
    resizeMode: 'contain',
    marginBottom: 60,
  },
  modalConiner: {
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'absolute',
  },
});
