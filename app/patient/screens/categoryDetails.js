import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';

// DataBase
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../navigation/AuthProvider';

//My Imports (in this case my files)
import colors from '../../config/colors';
import font from '../../config/font';
import {windowWidth} from '../../utils/Dimentions';

//Libraries
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {Avatar, ListItem} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import BlogCustom from './subScreen/BlogCustom';

const Details = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [ProfessionalData, setProfessionalData] = useState(null);
  const [patientData, setPatientData] = useState();
  const [userData, setUserData] = useState(null);

  const [GeneralBlogs, setGeneralBlogs] = useState(null);
  const [BipolarBlogs, setBipolarBlogs] = useState(null);
  const [StressBlogs, setStressBlogs] = useState(null);
  const [DementiaBlogs, setDementiaBlogs] = useState(null);
  const [InsomniaBlogs, setInsomniaBlogs] = useState(null);
  const [AnxietyBlogs, setAnxietyBlogs] = useState(null);
  const [SchizophentaBlogs, setSchizophentaBlogs] = useState(null);
  const Categories = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: Categories.name,

      headerStyle: {elevation: 0},
      headerTitleStyle: {
        color: colors.text,
        fontFamily: font.title,
      },
      headerTitleAlign: 'center',
      headerTintColor: colors.text,

      headerLeft: () => (
        <View style={{marginLeft: 10}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon name="chevron-back" size={25} color={colors.text} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const getProfessional = async () => {
    await firestore()
      .collection('Professional')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setProfessionalData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getProfessional();
    getUser();
    const fetcGeneralBlogs = firestore()
      .collection('Blogs')
      .where('Category', '==', 'GENERAL')
      .onSnapshot(snapshot =>
        setGeneralBlogs(
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
            Category: doc.data().Category,
          })),
        ),
      );
    const fetcBipolarBlogs = firestore()
      .collection('Blogs')
      .where('Category', '==', 'BIPOLAR DISORDER')
      .onSnapshot(snapshot =>
        setBipolarBlogs(
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
            Category: doc.data().Category,
          })),
        ),
      );
    const fetcStressBlogs = firestore()
      .collection('Blogs')
      .where('Category', '==', 'STRESS')
      .onSnapshot(snapshot =>
        setStressBlogs(
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
    const fetcDementiaBlogs = firestore()
      .collection('Blogs')
      .where('Category', '==', 'DEMENTIA')
      .onSnapshot(snapshot =>
        setDementiaBlogs(
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
    const fetcInsomniaBlogs = firestore()
      .collection('Blogs')
      .where('Category', '==', 'INSOMNIA')
      .onSnapshot(snapshot =>
        setInsomniaBlogs(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
            professionalId: doc.data().professionalId,
            professionalAvatar: doc.data().professionalAvatar,
            professionalName: doc.data().professionalName,
            Blog: doc.data().Blog,
            Content: doc.data().Content,
            Category: doc.data().Category,
            blogtImg: doc.data().blogtImg,
            blogTime: doc.data().blogTime,
          })),
        ),
      );
    const fetcAnxietyBlogs = firestore()
      .collection('Blogs')
      .where('Category', '==', 'ANXIETY')
      .onSnapshot(snapshot =>
        setAnxietyBlogs(
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
    const fetcSchizophentaBlogs = firestore()
      .collection('Blogs')
      .where('Category', '==', 'SCHIZOPHRENIA')
      .onSnapshot(snapshot =>
        setSchizophentaBlogs(
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
    return (
      fetcBipolarBlogs,
      fetcStressBlogs,
      fetcDementiaBlogs,
      fetcInsomniaBlogs,
      fetcAnxietyBlogs,
      fetcSchizophentaBlogs,
      fetcGeneralBlogs
    );
  }, [navigation]);

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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flex: 1}}>
        {Categories.name == 'GENERAL' ? (
          <>
            {GeneralBlogs?.[0] ? (
              <FlatList
                data={GeneralBlogs}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
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
                  source={Categories.source}
                  style={{
                    height: 200,
                    width: 170,
                  }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: font.title,
                    color: colors.text,
                  }}>
                  {Categories.name} CATEGORY LIST
                </Text>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: font.subtitle,
                      color: colors.subtext,
                      textAlign: 'center',
                      width: windowWidth - 50,
                      lineHeight: 27,
                    }}>
                    This page will be updated if a professional posts a blog in
                    the {Categories.name} category.
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : Categories.name == 'BIPOLAR DISORDER' ? (
          <>
            {BipolarBlogs?.[0] ? (
              <FlatList
                data={BipolarBlogs}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
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
                  source={Categories.source}
                  style={{
                    height: 200,
                    width: 170,
                  }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: font.title,
                    color: colors.text,
                  }}>
                  {Categories.name} CATEGORY LIST
                </Text>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: font.subtitle,
                      color: colors.subtext,
                      textAlign: 'center',
                      width: windowWidth - 50,
                      lineHeight: 27,
                    }}>
                    This page will be updated if a professional posts a blog in
                    the {Categories.name} category.
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : Categories.name == 'STRESS' ? (
          <>
            {StressBlogs?.[0] ? (
              <FlatList
                data={StressBlogs}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
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
                  source={Categories.source}
                  style={{
                    height: 200,
                    width: 170,
                  }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: font.title,
                    color: colors.text,
                  }}>
                  {Categories.name} CATEGORY LIST
                </Text>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: font.subtitle,
                      color: colors.subtext,
                      textAlign: 'center',
                      width: windowWidth - 50,
                      lineHeight: 27,
                    }}>
                    This page will be updated if a professional posts a blog in
                    the {Categories.name} category.
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : Categories.name == 'DEMENTIA' ? (
          <>
            {DementiaBlogs?.[0] ? (
              <FlatList
                data={DementiaBlogs}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
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
                  source={Categories.source}
                  style={{
                    height: 200,
                    width: 170,
                  }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: font.title,
                    color: colors.text,
                  }}>
                  {Categories.name} CATEGORY LIST
                </Text>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: font.subtitle,
                      color: colors.subtext,
                      textAlign: 'center',
                      width: windowWidth - 50,
                      lineHeight: 27,
                    }}>
                    This page will be updated if a professional posts a blog in
                    the {Categories.name} category.
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : Categories.name == 'INSOMNIA' ? (
          <>
            {InsomniaBlogs?.[0] ? (
              <FlatList
                data={InsomniaBlogs}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
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
                  source={Categories.source}
                  style={{
                    height: 200,
                    width: 170,
                  }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: font.title,
                    color: colors.text,
                  }}>
                  {Categories.name} CATEGORY LIST
                </Text>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: font.subtitle,
                      color: colors.subtext,
                      textAlign: 'center',
                      width: windowWidth - 50,
                      lineHeight: 27,
                    }}>
                    This page will be updated if a professional posts a blog in
                    the {Categories.name} category.
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : Categories.name == 'ANXIETY' ? (
          <>
            {AnxietyBlogs?.[0] ? (
              <FlatList
                data={AnxietyBlogs}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
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
                  source={Categories.source}
                  style={{
                    height: 200,
                    width: 170,
                  }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: font.title,
                    color: colors.text,
                  }}>
                  {Categories.name} CATEGORY LIST
                </Text>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: font.subtitle,
                      color: colors.subtext,
                      textAlign: 'center',
                      width: windowWidth - 50,
                      lineHeight: 27,
                    }}>
                    This page will be updated if a professional posts a blog in
                    the {Categories.name} category.
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : Categories.name == 'SCHIZOPHRENIA' ? (
          <>
            {SchizophentaBlogs?.[0] ? (
              <FlatList
                data={SchizophentaBlogs}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
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
                  source={Categories.source}
                  style={{
                    height: 200,
                    width: 170,
                  }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: font.title,
                    color: colors.text,
                  }}>
                  {Categories.name} CATEGORY LIST
                </Text>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: font.subtitle,
                      color: colors.subtext,
                      textAlign: 'center',
                      width: windowWidth - 50,
                      lineHeight: 27,
                    }}>
                    This page will be updated if a professional posts a blog in
                    the {Categories.name} category.
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default Details;
