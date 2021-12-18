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
import BlogSwitch from '../../config/components/BlogSwitch';
const BlogScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [profData, setProfData] = useState(null);
  const [allPosts, setAllPost] = useState(null);
  const [ownPosts, setOwnPosts] = useState(null);
  const [requests, setRequests] = useState(true);

  const Categories = [
    {
      id: 1,
      name: 'GENERAL',
      source: require('../../assets/image/Blog/NEW/General.png'),
    },
    {
      id: 2,
      name: 'BIPOLAR DISORDER',
      source: require('../../assets/image/Blog/NEW/Biolar_Disorder.png'),
    },
    {
      id: 3,
      name: 'STRESS',
      source: require('../../assets/image/Blog/NEW/STRESS.png'),
    },
    {
      id: 4,
      name: 'DEMENTIA',
      source: require('../../assets/image/Blog/NEW/DEMENTIA.png'),
    },
    {
      id: 5,
      name: 'INSOMNIA',
      source: require('../../assets/image/Blog/NEW/INSOMNIA.png'),
    },
    {
      id: 6,
      name: 'ANXIETY',
      source: require('../../assets/image/Blog/NEW/ANXIETY.png'),
    },
    {
      id: 7,
      name: 'SCHIZOPHRENIA',
      source: require('../../assets/image/Blog/NEW/SCHIZOPHRENIA.png'),
    },
  ];

  const Card = ({Categories}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Details', Categories)}
        style={styles.boxContainer}
        activeOpacity={0.8}>
        <LinearGradient
          colors={['#f0e6fa', '#fff', '#f7f3fc']}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          style={styles.boxGred}>
          <Image
            source={Categories.source}
            style={{width: '100%', height: '80%', resizeMode: 'contain'}}
          />

          <View style={styles.cardDetails}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.Title}>{Categories.name}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const onSelectSwitch = value => {
    setRequests(value);
  };

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
      <BlogSwitch
        selectionMode={1}
        option1="RECENT"
        option2="CATEGORIES"
        onSelectSwitch={onSelectSwitch}
      />
      {requests == 1 && (
        <View style={{flex: 1}}>
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
        </View>
      )}
      {requests == 2 && (
        <FlatList
          columnWrapperStyle={{
            justifyContent: 'space-around',
            marginVertical: 10,
            marginHorizontal: 5,
          }}
          data={Categories}
          keyExtractor={item => item.id}
          numColumns={2}
          renderItem={({id, item}) => (
            <Card Categories={item} />
            //     return <Card Categories={item} />;
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default BlogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerStyles: {
    width: '70%',
    backgroundColor: 'gray',
    color: 'white',
  },
  boxGred: {
    // marginHorizontal: 15,
    // marginVertical: 5,
    alignItems: 'center',
    borderRadius: 7,
    height: 180,
    zIndex: 100,
    width: windowWidth / 2 - 30,
    padding: 10,
  },
  boxContainer: {
    // margin: 10,
    height: 180,
    width: windowWidth / 2 - 30,
    borderRadius: 7,
    justifyContent: 'center',
    elevation: 2,
    alignItems: 'center',
  },
  card: {
    height: 280,
    width: windowWidth / 2 - 30,
    elevation: 4,
    marginRight: 10,
    borderRadius: 7,
    backgroundColor: '#fff',
  },
  cardImage: {
    height: 200,
    // width: '100%',
  },
  cardDetails: {
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Title: {fontFamily: font.title, fontSize: 15, color: colors.text},
});
