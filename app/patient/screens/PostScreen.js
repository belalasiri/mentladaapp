import React, {useEffect, useState, useContext, useLayoutEffect} from 'react';
import {
  FlatList,
  Alert,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  Modal,
  Button,
  ToastAndroid,
  Image,
} from 'react-native';
import firestore, {firebase} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../navigation/AuthProvider';

import colors from '../../config/colors';
import font from '../../config/font';

import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

import {Avatar} from 'react-native-elements';
import CustomPost from '../../config/components/CustomPost';
import {windowHeight, windowWidth} from '../../utils/Dimentions';

const PostScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [posts, setPosts] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [CommentsList, setComments] = useState([]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Mentlada Social',
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
              // navigation.openDrawer();
            }}>
            <Avatar
              rounded
              source={{
                uri: userData
                  ? userData.userImg ||
                    'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                  : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{marginRight: 20}}>
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
  }, [userData]);

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };

  useLayoutEffect(() => {
    const fetchPosts = firestore()
      .collection('posts')
      .orderBy('postTime', 'desc')
      .onSnapshot(snapshot =>
        setPosts(
          snapshot.docs.map(doc => ({
            id: doc.id,
            userId: doc.data().userId,
            userName: 'Mentlada Patient',
            userImg: 'https://i.ibb.co/pv5S0nm/logo.png',
            postTime: doc.data().postTime,
            post: doc.data().post,
            postImg: doc.data().postImg,
            liked: false,
            likes: doc.data().likes,
            comments: doc.data().comments,
          })),
        ),
      );
    if (loading) {
      setLoading(false);
    }
    return fetchPosts;
  }, [route, navigation]);

  const deletePost = postId => {
    console.log('Current Post Id: ', postId);
    setDeleting(true);

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

  const deleteFirestoreData = postId => {
    firestore()
      .collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        // Alert.alert(
        //   'Post deleted!',
        //   'Your post has been deleted successfully!',
        // );
        setDeleting(false);
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      {posts?.[0] ? (
        <FlatList
          initialNumToRender={7}
          data={posts}
          keyExtractor={item => item.id}
          renderItem={({id, item}) =>
            item.userId === auth().currentUser.uid ? null : ( // <CustomPost
              //   item={item}
              //   onPress={() => navigation.navigate('Profile')}
              //   onDelete={handleDelete}
              // />
              <CustomPost
                item={item}
                onPress={() =>
                  navigation.navigate('HomeProfile', {userId: item.userId})
                }
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
            )
          }
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/image/image.png')}
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
              Posts list
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
              When any patient post a post, that post will appear here.
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PostScreen;
