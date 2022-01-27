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

import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import {Avatar, ListItem} from 'react-native-elements';

import {AuthContext} from '../../navigation/AuthProvider';
import Header from '../../config/components/Home/Header';
import Spacer from '../../config/components/Home/Spacer';
import colors from '../../config/colors';
import font from '../../config/font';
import Conversation from '../../assets/conversation.svg';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, FONTS, icons} from '../../constants';
import HeaderText from './subScreen/HeaderText';
import Stars from './subScreen/Stars';

const {width} = Dimensions.get('screen');
const cardWidth = width / 1.6;
const footerWidth = width;

const HomeScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [Profdata, setProfdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allBlogs, setAllBlogs] = useState(null);
  const [Headers, setHeader] = useState('Nothing');

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  // maxToRenderPerBatch={5}
  useLayoutEffect(() => {
    const fetcBlogs = firestore()
      .collection('Blogs')
      .limit(3)
      .orderBy('blogTime', 'desc')
      .onSnapshot(snapshot =>
        setAllBlogs(
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

    const FETCH_HEADER = firestore()
      .collection('Header')
      .orderBy('lastUpdated', 'desc')
      .onSnapshot(snapshot =>
        setHeader(
          snapshot.docs.map(doc => ({
            id: doc.id,
            HeaderText: doc.data().HeaderText,
          })),
        ),
      );
    return fetcBlogs, FETCH_HEADER;
  }, []);

  let profList = [];
  const fetchProf = async () => {
    await firestore()
      .collection('Professional')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          profList.push({
            id: doc.id,
            fname: doc.data().fname,
            lname: doc.data().lname,
            email: doc.data().email,
            about: doc.data().about,
            Experience: doc.data().Experience,
            License: doc.data().License,
            Specialty: doc.data().Specialty,
            userImg: doc.data().userImg,
            role: doc.data().role,
            professionalId: doc.data().professionalId,
            Verified: doc.data().Verified,
          });
        });
      })
      .catch(e => {
        console.log(e);
      });
    setProfdata(profList);

    if (loading) {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchProf();
    getUser();
  }, [userData, user]);

  if (loading == true) {
    return (
      <View style={[styles.containerLoading, styles.horizontal]}>
        <ActivityIndicator size="large" color={COLORS.green} />
      </View>
    );
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header
          UserName={[
            userData ? userData.fname || 'Mentlada' : 'Mentlada',
            ' ',
            userData ? userData.lname || 'Patient' : 'Patient',
          ]}
          Userimage={{
            uri: userData
              ? userData.userImg ||
                'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg'
              : 'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
          }}
          onNotificationPress={() => navigation.navigate('Notification')}
        />
        <Spacer size={10} />
        <LinearGradient
          colors={['#f7f3fc', '#fff']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={{
            marginHorizontal: 15,
            paddingHorizontal: 15,
            marginVertical: 5,
            paddingVertical: 20,
            borderRadius: 7,
            padding: 10,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="trophy-outline" size={35} color={COLORS.secondary} />

            {Headers.map(item => (
              <HeaderText key={item.id} item={item} />
            ))}
          </View>
        </LinearGradient>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            alignItems: 'center',
            paddingTop: 10,
          }}>
          <Text
            style={{
              fontFamily: font.title,
              color: COLORS.secondary,
              fontSize: 16,
            }}>
            Professional's for you
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('professionaList')}>
            <Text style={{...FONTS.h7, color: COLORS.primary}}>See more</Text>
          </TouchableOpacity>
        </View>

        <Animated.FlatList
          onMomentumScrollEnd={e => {
            setActiveCardIndex(
              Math.round(e.nativeEvent.contentOffset.x / cardWidth),
            );
          }}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: true},
          )}
          horizontal
          data={Profdata}
          contentContainerStyle={{
            paddingVertical: 20,
            paddingLeft: 20,
            paddingRight: cardWidth / 2 - 40,
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            const inputRange = [
              (index - 1) * cardWidth,
              index * cardWidth,
              (index + 1) * cardWidth,
            ];
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.7, 0, 0.7],
            });
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1, 0.8],
            });
            return (
              <TouchableOpacity
                disabled={activeCardIndex != index}
                activeOpacity={1}
                onPress={() =>
                  navigation.navigate('ProfProfile', {
                    profName: item.fname + ' ' + item.lname,
                    profEmail: item.email,
                    profAvatar: item.userImg,
                    profRole: item.role,
                    profExperience: item.Experience,
                    profAbout: item.about,
                    profLicense: item.License,
                    profSpecialty: item.Specialty,
                    professionalId: item.professionalId,
                    Verified: item.Verified,
                    userName: userData.fname + ' ' + userData.lname,
                    userEmail: userData.email,
                    userAvatar: userData.userImg,
                    userRole: userData.role,
                  })
                }>
                <Animated.View style={{...styles.card, transform: [{scale}]}}>
                  <Animated.View style={{...styles.cardOverLay, opacity}} />
                  <View style={styles.Tag}>
                    <Text style={{color: COLORS.primary, ...FONTS.h6}}>
                      {item.Experience}
                    </Text>
                  </View>
                  <Image
                    source={{
                      uri: Profdata
                        ? item.userImg ||
                          'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg'
                        : 'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
                    }}
                    style={styles.cardImage}
                  />
                  <View style={styles.cardDetails}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                          }}>
                          <Text
                            style={{
                              fontSize: 16,
                              color: COLORS.secondary,
                              ...FONTS.h4_2,
                              textAlign: 'left',
                            }}>
                            {Profdata ? item.fname || 'Mentlada' : 'Mentlada'}{' '}
                            {Profdata ? item.lname || 'Mentlada' : 'Mentlada'}
                          </Text>
                          {item.Verified ==
                          'notVerified' ? null : item.Verified == 'Verified' ? (
                            <View
                              style={{
                                paddingTop: 5,
                              }}>
                              <Image
                                source={icons.verifiedUser}
                                style={{
                                  width: 17,
                                  height: 17,
                                  marginLeft: 3,
                                  tintColor: COLORS.primary,
                                }}
                              />
                            </View>
                          ) : null}
                        </View>

                        <Text
                          style={{
                            color: colors.subtext,
                            fontSize: 12,
                            fontFamily: font.title,
                          }}>
                          {Profdata
                            ? item.Specialty || 'Mentlada'
                            : 'Spacialist'}
                        </Text>
                      </View>
                      <Icon
                        name="chevron-forward-outline"
                        size={26}
                        color={colors.primary}
                      />
                    </View>
                    <Stars item={item} />
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          }}
          snapToInterval={cardWidth}
        />

        {/* setions plan */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            alignItems: 'center',
            paddingTop: 10,
          }}>
          <Text
            style={{
              fontFamily: font.title,
              color: colors.text,
              fontSize: 16,
            }}>
            Book consultation session
          </Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('sessionPlan')}>
          <LinearGradient
            colors={['#e8daf7', '#f7f3fc']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{
              flexDirection: 'row',
              marginHorizontal: 15,
              marginVertical: 5,
              alignItems: 'center',
              borderRadius: 7,
              padding: 10,
              paddingVertical: 20,
            }}>
            <MaterialIcons
              name="book-online"
              size={40}
              color={colors.subtext}
            />
            <View
              style={{
                flex: 1,
                alignItems: 'flex-start',
                justifyContent: 'center',
                marginHorizontal: 20,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 15,
                    color: colors.text,
                    fontFamily: font.title,
                  }}>
                  Get started now
                </Text>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.subtext,
                      fontFamily: font.subtitle,
                      paddingRight: 5,
                    }}>
                    Choose your session plan
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                // flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              <Icon name="chevron-forward" size={26} color="#a076cd" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <Spacer size={10} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            alignItems: 'center',
            paddingTop: 10,
          }}>
          <Text
            style={{
              fontFamily: font.title,
              color: colors.text,
              fontSize: 16,
            }}>
            Most recent blog
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Blog')}>
            <Text style={{...FONTS.h7, color: COLORS.primary}}>See more</Text>
          </TouchableOpacity>
        </View>

        <View style={{flex: 1}}>
          <FlatList
            horizontal
            data={allBlogs}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
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
                    professionalId: item.professionalId,
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
        </View>

        <View
          style={{
            flex: 1,
            width: footerWidth,
            alignSelf: 'center',
            justifyContent: 'flex-end',
            // height: 391,
          }}>
          <View style={{marginTop: 10}} />
          <View
            style={{
              height: footerWidth,
              width: footerWidth,
              alignSelf: 'center',
              // justifyContent: 'center',
            }}>
            <Conversation height={'100%'} width={'100%'} position="absolute" />
            <View
              style={{
                fontSize: 20,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 28,
                paddingHorizontal: 60,
              }}>
              <Text
                style={{
                  fontFamily: font.title,
                  color: colors.text,
                  fontSize: 22,
                  paddingHorizontal: 20,
                  textAlign: 'center',
                }}>
                Contact a personal therapist
              </Text>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigation.navigate('professionaList')}>
                <Text style={styles.buttonText}>Start a conversation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    paddingBottom: 3,
    width: windowWidth / 2,
    height: windowHeight / 15,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  buttonText: {
    fontSize: 15,
    color: colors.empty,
    fontFamily: font.title,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  card: {
    height: 280,
    width: cardWidth,
    elevation: 4,
    marginRight: 10,
    borderRadius: 7,
    backgroundColor: '#fff',
  },
  cardImage: {
    height: 200,
    width: '100%',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  Tag: {
    height: 45,
    width: 65,
    backgroundColor: COLORS.lightpurple,
    position: 'absolute',
    zIndex: 1,
    right: 0,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDetails: {
    height: 100,
    borderRadius: 15,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },
  cardOverLay: {
    height: 280,
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 100,
    width: cardWidth,
    borderRadius: 7,
  },
  topHotelCard: {
    height: 120,
    width: 120,
    backgroundColor: '#fff',
    elevation: 15,
    marginHorizontal: 10,
    borderRadius: 7,
  },
  topHotelCardImage: {
    height: 80,
    width: '100%',
    borderTopRightRadius: 7,
    borderTopLeftRadius: 7,
  },
});
