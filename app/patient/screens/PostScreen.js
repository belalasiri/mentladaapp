import React, {useState, useLayoutEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';

//DataBase
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

//Libraries
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-elements';

//Imports
import colors from '../../config/colors';
import font from '../../config/font';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import PostContent from './subScreen/PostContent';
import {COLORS, FONTS} from '../../constants';

const PostScreen = ({navigation, route}) => {
  const [posts, setPosts] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Mentlada Social',
      headerStyle: {elevation: 0},
      headerTitleStyle: {
        color: COLORS.secondary,
        ...FONTS.h4,
      },
      headerTitleAlign: 'center',
      headerTintColor: COLORS.secondary,
      headerLeft: () => (
        <View style={{marginLeft: 20}}>
          <Avatar
            rounded
            source={{
              uri: patientData
                ? patientData.userImg ||
                  'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
            }}
          />
        </View>
      ),
      headerRight: () => (
        <View style={{marginRight: 20}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.navigate('AddPost');
            }}>
            <Icon name="create-outline" size={25} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [patientData]);

  const getPatientData = async () => {
    await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setPatientData(documentSnapshot.data());
        }
      });
  };

  useLayoutEffect(() => {
    getPatientData();
    const FETCHPOSTS = firestore()
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
    return FETCHPOSTS;
  }, [route, navigation]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      {posts?.[0] ? (
        <FlatList
          initialNumToRender={3}
          data={posts}
          keyExtractor={item => item.id}
          renderItem={({id, item}) =>
            item.userId === auth().currentUser.uid ? null : (
              <PostContent
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
