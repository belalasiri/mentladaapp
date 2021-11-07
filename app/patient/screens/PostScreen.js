import React, {useEffect, useState} from 'react';
import {FlatList, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import PostCard from '../../config/components/PostCard';
import {Container} from '../styles/FeedStyles';
import storage from '@react-native-firebase/storage';

const Posts = [
  {
    id: '1',
    userName: 'Belal Alqadasi',
    userImg: require('../../assets/image/users/user_1.jpg'),
    postTime: '4 mins ago',
    post: 'Hey there, this is my test for a post of my Mentlada app in React Native.',
    postImg: require('../../assets/image/post/img_1.jpg'),
    liked: true,
    likes: '14',
    comments: '5',
  },
  {
    id: '2',
    userName: 'Ahmed Asiri',
    userImg: require('../../assets/image/users/user_4.jpg'),
    postTime: '2 hours ago',
    post: 'Hey there, this is my test for a post of my Mentlada app in React Native.',
    postImg: 'none',
    liked: false,
    likes: '8',
    comments: '0',
  },
  {
    id: '3',
    userName: 'Eng.Amer Aljabre',
    userImg: require('../../assets/image/users/user_2.jpg'),
    postTime: '1 hours ago',
    post: 'Hey there, this is my test for a post of my Mentlada app in React Native.',
    postImg: require('../../assets/image/post/img_2.jpg'),
    liked: true,
    likes: '1',
    comments: '0',
  },
  {
    id: '4',
    userName: 'Hanan Alatas',
    userImg: require('../../assets/image/users/user_5.jpg'),
    postTime: '1 day ago',
    post: 'Hey there, this is my test for a post of my Mentlada app in React Native.',
    postImg: require('../../assets/image/post/img_3.jpg'),
    liked: true,
    likes: '22',
    comments: '4',
  },
  {
    id: '5',
    userName: 'Bari Abikar',
    userImg: require('../../assets/image/users/user_3.jpg'),
    postTime: '2 days ago',
    post: 'Hey there, this is my test for a post of my Mentlada app in React Native.',
    postImg: 'none',
    liked: false,
    likes: '0',
    comments: '0',
  },
];

const PostScreen = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);

  const fetchPosts = async () => {
    try {
      const list = [];

      await firestore()
        .collection('posts')
        .orderBy('postTime', 'desc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const {userId, post, postImg, postTime, likes, comments} =
              doc.data();
            list.push({
              id: doc.id,
              userId,
              userName: 'Mentlada user',
              userImg: 'https://i.ibb.co/pv5S0nm/logo.png',
              postTime: postTime,
              post,
              postImg: postImg,
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

      console.log('Posts: ', list);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
    setDeleted(false);
  }, [deleted]);

  // confrmation message before deleting the post
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
                console.log(`${postImg} has been deleted successfully.`);
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
        Alert.alert(
          'Post deleted!',
          'Your post has been deleted successfully!',
        );
        setDeleted(true);
      })
      .catch(e => console.log('Error deleting posst.', e));
  };
  return (
    <Container>
      <FlatList
        data={posts}
        renderItem={({item}) => (
          <PostCard item={item} onDelete={handleDelete} />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default PostScreen;
