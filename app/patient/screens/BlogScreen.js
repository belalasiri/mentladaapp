import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

//DataBase
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../navigation/AuthProvider';

//Libraries
import {Avatar} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

//Imports
import colors from '../../config/colors';
import font from '../../config/font';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import BlogSwitch from '../../config/components/BlogSwitch';
import BlogCustom from './subScreen/BlogCustom';
import {COLORS, FONTS, SIZES} from '../../constants';

const BlogScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [allPosts, setAllPost] = useState(null);
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
      title: 'Mentlada Blog',
      headerStyle: {elevation: 0},
      headerTitleStyle: {
        color: COLORS.secondary,
        ...FONTS.h4,
      },
      headerTitleAlign: 'center',
      headerTintColor: COLORS.secondary,
      headerLeft: () => (
        <View style={{marginLeft: 20}}>
          <View>
            <Avatar
              rounded
              source={{
                uri: userData
                  ? userData.userImg ||
                    'https://i.ibb.co/2kR5zq0/Final-Logo.png'
                  : 'https://i.ibb.co/2kR5zq0/Final-Logo.png',
              }}
            />
          </View>
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
            Category: doc.data().Category,
            blogTime: doc.data().blogTime,
          })),
        ),
      );
    return fetcBlogs;
  }, [navigation]);

  useEffect(() => {
    getUser();
  }, [navigation]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <BlogSwitch
        selectionMode={1}
        option1="RECENT"
        option2="CATEGORIES"
        onSelectSwitch={onSelectSwitch}
      />
      {requests == 1 && (
        <View style={{flex: 1}}>
          {allPosts?.[0] ? (
            <FlatList
              data={allPosts}
              keyExtractor={item => item.id}
              renderItem={({id, item}) => (
                <BlogCustom
                  item={item}
                  onPress={() =>
                    navigation.navigate('BlogContent', {
                      id: item.id,
                      data: item.data,
                      Blog: item.Blog,
                      Content: item.Content,
                      blogtImg: item.blogtImg,
                      professionalAvatar: item.professionalAvatar,
                      professionalName: item.professionalName,
                      Category: item.Category,
                      blogTime: item.blogTime,
                      professionalId: item.professionalId,
                    })
                  }
                />
              )}
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
                  Blog list
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
                  When any professional post a Blog, The blog will appear here.
                </Text>
              </View>
            </View>
          )}
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
          renderItem={({item}) => <Card Categories={item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default BlogScreen;

const styles = StyleSheet.create({
  boxGred: {
    alignItems: 'center',
    borderRadius: 7,
    height: 180,
    zIndex: 100,
    width: SIZES.width / 2 - 30,
    padding: 10,
  },
  boxContainer: {
    height: 180,
    width: SIZES.width / 2 - 30,
    borderRadius: 7,
    justifyContent: 'center',
    elevation: 1,
    alignItems: 'center',
  },
  cardDetails: {
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Title: {fontFamily: font.title, fontSize: 15, color: COLORS.secondary},
});
