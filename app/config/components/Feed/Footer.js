import React, {useLayoutEffect, useState, useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../colors';
import {AuthContext} from '../../../navigation/AuthProvider';
import firestore, {firebase} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const Footer = ({
  CommentsLength,
  onCommentPress,
  disLikeThePost,
  likeList,
  likeThePost,
  itemID,
}) => {
  const [likerList, setLikerList] = useState([]);
  const [likedData, setLikedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getLikedData = async () => {
    await firestore()
      .collection('posts')
      .doc(itemID)
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

  useEffect(() => {
    getLikedData();
  }, [likedData]);

  return (
    <View style={styles.container}>
      {likedData.likerId === auth().currentUser.uid ? (
        <TouchableOpacity style={styles.iconContainer} onPress={disLikeThePost}>
          <AntDesign name={'hearto'} size={22} color="red" />
          <Text style={styles.number}>{likeList}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.iconContainer} onPress={likeThePost}>
          <AntDesign name={'hearto'} size={22} color="grey" />
          <Text style={styles.number}>{likeList}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.iconContainer} onPress={onCommentPress}>
        <Feather name={'message-circle'} size={22} color="grey" />
        <Text style={styles.number}>{CommentsLength}</Text>
      </TouchableOpacity>
      {/* <Text>{itemID}</Text> */}
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
