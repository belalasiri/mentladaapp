import React from 'react';
import {FlatList} from 'react-native';

import PostCard from '../../config/components/PostCard';
import {Container} from '../styles/FeedStyles';

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
  return (
    <Container>
      <FlatList
        data={Posts}
        renderItem={({item}) => <PostCard item={item} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default PostScreen;
