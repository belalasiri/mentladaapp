import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Animated,
  ActivityIndicator,
} from 'react-native';

import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../navigation/AuthProvider';

import {Avatar, ListItem} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../../config/colors';
import font from '../../config/font';
import {windowWidth} from '../../utils/Dimentions';
const BlogScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState(true);
  const [ApprovedChats, setApprovedChats] = useState([]);
  const [PendingChats, setPendingChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPost] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'BLOG',
      headerStyle: {
        // backgroundColor: 'transparent',
        backgroundColor: '#e8daf7',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleStyle: {color: '#000', fontFamily: font.title},

      headerTitleAlign: 'center',

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
    const fetcBlogs = firestore()
      .collection('Blogs')
      .orderBy('blogTime', 'desc')
      .onSnapshot(snapshot =>
        setAllPost(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
            professionalId: doc.data().professionalId,
            professionalAvatar: doc.data().professionalAvatar,
            professionalName: doc.data().professionalName,
            Blog: doc.data().Blog,
            Content: doc.data().Content,
            blogtImg: doc.data().blogtImg,
            blogTime: doc.data().blogTime,
          })),
        ),
      );
    return fetcBlogs;
  }, [route]);

  useEffect(() => {
    getUser();
  }, [navigation]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <FlatList
        data={allPosts}
        keyExtractor={item => item.id}
        renderItem={({id, item}) => (
          <ListItem
            onPress={() =>
              navigation.navigate('BlogContent', {
                Blog: item.Blog,
                Content: item.Content,
                blogtImg: item.blogtImg,
                professionalAvatar: item.professionalAvatar,
                professionalName: item.professionalName,
                blogTime: item.blogTime,
              })
            }>
            <View
              style={{
                width: windowWidth / 1 - 30,
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <LinearGradient
                colors={['#f0e6fa', '#fff', '#f7f3fc']}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                style={{
                  flexDirection: 'row',
                  borderRadius: 7,
                }}>
                <View style={{width: 100}}>
                  <Image
                    source={{uri: item.blogtImg}}
                    style={{
                      width: 100,
                      height: 150,
                      borderTopLeftRadius: 7,
                      borderBottomLeftRadius: 7,
                    }}
                  />
                </View>
                <ListItem.Content
                  style={{
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    marginLeft: 20,
                    paddingRight: 3,
                    paddingVertical: 10,
                  }}>
                  <ListItem.Title
                    style={{
                      fontSize: 15,
                      color: colors.text,
                      fontFamily: font.title,
                    }}>
                    {item.Blog}
                  </ListItem.Title>
                  <ListItem.Subtitle
                    style={{
                      fontSize: 13,
                      color: colors.subtext,
                      fontFamily: font.subtitle,
                      paddingRight: 5,
                      paddingVertical: 7,
                    }}
                    numberOfLines={3}
                    ellipsizeMode="tail">
                    {item.Content}
                  </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </LinearGradient>
            </View>
          </ListItem>
        )}
      />
    </SafeAreaView>
  );
};

export default BlogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontFamily: font.title,
    color: colors.text,
  },
  subText: {
    fontSize: 12,
    fontFamily: font.subtitle,
    color: colors.subtext,
    textAlign: 'center',
    width: windowWidth - 50,
    lineHeight: 27,
  },
});
