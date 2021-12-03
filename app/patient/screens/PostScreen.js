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
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../navigation/AuthProvider';

import colors from '../../config/colors';
import font from '../../config/font';

import Feather from 'react-native-vector-icons/Feather';

import {Avatar} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import CustomPost from '../../config/components/CustomPost';

const PostScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [posts, setPosts] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
          <TouchableOpacity activeOpacity={0.5}>
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

  useEffect(() => {
    getUser();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />

      <FlatList
        initialNumToRender={7}
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({id, item}) =>
          item.userId === auth().currentUser.uid ? (
            <CustomPost
              item={item}
              onPress={() => navigation.navigate('Profile')}
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
