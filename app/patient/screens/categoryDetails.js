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
import {ListItem} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

const Heder = ({onBacePress, onAddPress, name}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        // marginTop: 5,
        alignItems: 'center',
      }}>
      {/* GoBack */}
      <TouchableOpacity
        style={{
          width: 45,
          height: 45,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onBacePress}>
        <Icon name="chevron-back" size={25} color={colors.text} />
      </TouchableOpacity>

      {/* Title */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{color: colors.text, fontSize: 20, fontFamily: font.title}}>
          {name}
        </Text>
      </View>

      {/* Profile */}
      <View style={{marginRight: 20}}>
        <TouchableOpacity activeOpacity={0.5} onPress={onAddPress}>
          <Feather name="plus-square" size={25} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Details = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [ProfessionalData, setProfessionalData] = useState(null);
  const [GeneralBlogs, setGeneralBlogs] = useState(null);
  const [BipolarBlogs, setBipolarBlogs] = useState(null);
  const [StressBlogs, setStressBlogs] = useState(null);
  const [DementiaBlogs, setDementiaBlogs] = useState(null);
  const [InsomniaBlogs, setInsomniaBlogs] = useState(null);
  const [AnxietyBlogs, setAnxietyBlogs] = useState(null);
  const [SchizophentaBlogs, setSchizophentaBlogs] = useState(null);
  const Categories = route.params;
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Heder
        name={Categories.name}
        onBacePress={() => navigation.goBack()}
        onAddPress={() => navigation.navigate('addBlog')}
      />
      <View style={{flex: 1}}>
        {Categories.name == 'GENERAL' ? (
          <>
            {GeneralBlogs?.[0] ? (
              <FlatList
                data={GeneralBlogs}
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
                        Category: item.Category,
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
                        Category: item.Category,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
