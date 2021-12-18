import React, {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useRef,
} from 'react';
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

import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../navigation/AuthProvider';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

import LinearGradient from 'react-native-linear-gradient';

import font from '../../config/font';
import colors from '../../config/colors';
import BlogSwitch from '../components/BlogSwitch';
import {windowWidth} from '../../utils/Dimentions';
import {Avatar, ListItem} from 'react-native-elements';
import CategoryBox from '../components/CategoryBox';
const width = Dimensions.get('window').width / 2 - 30;

const ProfBlog = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
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

  const onSelectSwitch = value => {
    setRequests(value);
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

  useLayoutEffect(() => {
    const fetchOwnBlogs = firestore()
      .collection('Blogs')
      .where('professionalEmail', '==', user.email)
      .onSnapshot(snapshot =>
        setOwnPosts(
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
    return fetchOwnBlogs;
  }, [navigation]);

  useEffect(() => {
    getProf();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <BlogSwitch
        selectionMode={1}
        option1="RECENT"
        option2="YOUR BLOGS"
        option3="CATEGORIES"
        onSelectSwitch={onSelectSwitch}
      />
      {requests == 1 && (
        <View style={{flex: 1}}>
          {allPosts?.[0] ? (
            <FlatList
              data={allPosts}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
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
                      Category: item.Category,
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
                          source={{
                            uri:
                              item.blogtImg ||
                              'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
                          }}
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
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/image/illustrationOk1.png')}
                style={{
                  height: 170,
                  width: 170,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.title,
                  color: colors.text,
                }}>
                Blog list
              </Text>
              <View>
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
        <View style={{flex: 1}}>
          {ownPosts?.[0] ? (
            <FlatList
              data={ownPosts}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
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
                      Category: item.Category,
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
                          source={{
                            uri:
                              item.blogtImg ||
                              'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
                          }}
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
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/image/illustrationOk1.png')}
                style={{
                  height: 170,
                  width: 170,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.title,
                  color: colors.text,
                }}>
                Your own Blogs
              </Text>
              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: font.subtitle,
                    color: colors.subtext,
                    textAlign: 'center',
                    width: windowWidth - 120,
                    lineHeight: 27,
                  }}>
                  When you post a Blog, it will appear here.
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
      {requests == 3 && (
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

export default ProfBlog;

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
{
  /* 
  <FlatList
  columnWrapperStyle={{justifyContent: 'space-around'}}
  data={Categories}
  keyExtractor={item => item.id}
  numColumns={2}
  renderItem={({id, item}) => (
    <CategoryBox
      Title={item.name}
      image={item.source}
      onPress={() => {}}
    />
  )}
/>
  */
}
// <ScrollView>
//   <View style={{alignItems: 'center'}}>
//     <View
//       style={{flexDirection: 'row', justifyContent: 'space-around'}}>
//       <CategoryBox
//         Title="BIPOLAR DISORDER"
//         image={require('../../assets/image/Blog/BIPOLAR_DISORDER.png')}
//         onPress={() =>
//           navigation.navigate('BipolarDisorder', {
//             categoryData: item.name,
//           })
//         }
//       />
//       {/* navigation.navigate('BipolarDisorder', { categoryData: item }) */}
//       <CategoryBox
//         Title="STRESS"
//         image={require('../../assets/image/Blog/STRESS.png')}
//         onPress={() => navigation.navigate('Stress')}
//       />
//     </View>
//     <View
//       style={{flexDirection: 'row', justifyContent: 'space-around'}}>
//       <CategoryBox
//         Title="DEMENTIA"
//         image={require('../../assets/image/Blog/DEMENTIA.png')}
//         onPress={() => navigation.navigate('Dementia')}
//       />
//       <CategoryBox
//         Title="INSOMNIA"
//         image={require('../../assets/image/Blog/INSOMNIA.png')}
//         onPress={() => navigation.navigate('Insomnia')}
//       />
//     </View>
//     <View
//       style={{flexDirection: 'row', justifyContent: 'space-around'}}>
//       <CategoryBox
//         Title="ANXIETY"
//         image={require('../../assets/image/Blog/ANXIETY.png')}
//         onPress={() => navigation.navigate('Anxiety')}
//       />
//       <CategoryBox
//         Title="SCHIZOPHRENIA"
//         image={require('../../assets/image/Blog/SCHIZOPHRENIA.png')}
//         onPress={() => navigation.navigate('Schizophrenia')}
//       />
//     </View>
//   </View>
// </ScrollView>
