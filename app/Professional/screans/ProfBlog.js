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

import firestore, {firebase} from '@react-native-firebase/firestore';
import {AuthContext} from '../../navigation/AuthProvider';

import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import LinearGradient from 'react-native-linear-gradient';

import font from '../../config/font';
import colors from '../../config/colors';
import BlogSwitch from '../BlogSwitch';
import {windowWidth} from '../../utils/Dimentions';
import {Avatar, ListItem} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';

const ProfBlog = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [profData, setProfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [allPosts, setAllPost] = useState(null);
  const [ownPosts, setOwnPosts] = useState(null);
  const [requests, setRequests] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState();

  const [pokemon, setPokemon] = useState();

  const handleValueChange = itemValue => setPokemon(itemValue);

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
            blogTime: doc.data().blogTime,
          })),
        ),
      );
    // return fetcBlogs, fetchOwnBlogs;
    return fetchOwnBlogs;
  }, [navigation]);

  useEffect(() => {
    getProf();
  }, []);
  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

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
          {allPosts?.[0] ? (
            <FlatList
              data={ownPosts}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({id, item}) => (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <Text>02</Text>
                </View>
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
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <Text>03</Text>
          <Picker
            style={styles.pickerStyles}
            selectedValue={pokemon}
            onValueChange={handleValueChange}>
            <Picker.Item label="Pikacssshu" value="pikachu" />
            <Picker.Item label="Charmander" value="charmander" />
            <Picker.Item label="Squirtle" value="Squirtle" />
          </Picker>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfBlog;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
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
});
