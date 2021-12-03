import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';

import {AuthContext} from '../../navigation/AuthProvider';
import ProgressiveImage from './ProgressiveImage';
import {Avatar} from 'react-native-elements';
import {Divider} from '../../patient/styles/FeedStyles';
import {windowHeight} from '../../utils/Dimentions';
import colors from '../colors';
import font from '../font';
import ProfilePic from './Feed/ProfilePic';
import MainContainer from './Feed/MainContainer';

const CustomPost = ({item, onDelete, onPress}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    getUser();
  }, []);

  let UserName = (
    <Text>
      {userData ? userData.fname || 'Mentlada' : 'Mentlada'}{' '}
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
      />
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
      />
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
    borderBottomColor: colors.w,
  },
});
