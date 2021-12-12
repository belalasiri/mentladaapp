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
} from 'react-native';
import firestore, {firebase} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../navigation/AuthProvider';

import colors from '../../config/colors';
import font from '../../config/font';

import Feather from 'react-native-vector-icons/Feather';

import {Avatar} from 'react-native-elements';
import CustomPost from '../../config/components/CustomPost';

const PostScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [posts, setPosts] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Mentlada Social',
      headerStyle: {backgroundColor: '#e8daf7', elevation: 0},
      headerTitleStyle: {
        color: colors.text,
        fontFamily: font.title,
        textTransform: 'uppercase',
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
            <Feather name="plus-square" size={25} color={colors.text} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [userData]);

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

  useEffect(() => {
    getUser();
  }, [deleted]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        initialNumToRender={7}
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({id, item}) =>
          item.userId === auth().currentUser.uid ? (
            <CustomPost
              item={item}
              onPress={() => navigation.navigate('Profile')}
              onDelete={handleDelete}
            />
          ) : (
            <CustomPost
              item={item}
              onPress={() =>
                navigation.navigate('HomeProfile', {userId: item.userId})
              }
            />
          )
        }
      />
    </SafeAreaView>
  );
};

export default PostScreen;
