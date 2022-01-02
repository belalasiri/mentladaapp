import React, {useEffect, useState, useContext, useLayoutEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../colors';
import {AuthContext} from '../../../navigation/AuthProvider';
import firestore, {firebase} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const Footer = ({CommentsLength, onCommentPress, LikesLength, likeList}) => {
  const onLikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(userId)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(firebase.auth().currentUser.uid)
      .set({});
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer}>
        <AntDesign name={'hearto'} size={22} color="grey" />
        <Text style={styles.number}>{likeList}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={onCommentPress}>
        <Feather name={'message-circle'} size={22} color="grey" />
        <Text style={styles.number}>{CommentsLength}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
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
