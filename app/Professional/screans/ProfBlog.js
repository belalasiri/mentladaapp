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
import {AuthContext} from '../../navigation/AuthProvider';

import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import font from '../../config/font';
import colors from '../../config/colors';
import ListCard from '../../config/components/ListCard';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import Header from '../../config/components/Home/Header';
import Spacer from '../../config/components/Home/Spacer';
import Conversation from '../../assets/conversation.svg';
import {Avatar, ListItem} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import CustomBlog from '../../config/components/CustomBlog';

const ProfBlog = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [posts, setPosts] = useState(null);
  const [profData, setProfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [allPosts, setAllPost] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Mentlada Blog',
      // headerTransparent: true,
      headerStyle: {elevation: 0},
      headerTitleStyle: {
        color: colors.text,
        fontFamily: font.title,
        // textTransform: 'uppercase',
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
                uri: profData
                  ? profData.userImg ||
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
              navigation.navigate('addBlog');
            }}>
            <Feather name="plus-square" size={25} color={colors.text} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [profData]);

  const getProf = async () => {
    await firestore()
      .collection('Professional')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setProfData(documentSnapshot.data());
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
    getProf();
  }, []);
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
                id: item.id,
                data: item.data,
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
                width: windowWidth / 1 - 40,
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

export default ProfBlog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
