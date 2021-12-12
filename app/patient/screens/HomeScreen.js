import React, {useState, useEffect, useContext} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Animated,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {windowHeight, windowWidth} from '../../utils/Dimentions';

import {AuthContext} from '../../navigation/AuthProvider';
import Header from '../../config/components/Home/Header';
import Spacer from '../../config/components/Home/Spacer';
import colors from '../../config/colors';
import font from '../../config/font';
import Conversation from '../../assets/conversation.svg';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('screen');
const cardWidth = width / 1.6;
const footerWidth = width;

const HomeScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [Profdata, setProfdata] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;

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
    // navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading, userData, user]);

  if (loading == true) {
    return (
      <View style={[styles.containerLoading, styles.horizontal]}>
        <ActivityIndicator size="large" color={colors.green} />
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
        {/* <StatusBar hidden /> */}
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
            flexDirection: 'row',
            marginHorizontal: 15,
            marginVertical: 5,
            alignItems: 'center',
            borderRadius: 7,
            padding: 10,
            paddingVertical: 20,
          }}>
          <Icon name="trophy-outline" size={35} color={colors.subtext} />
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
                  fontSize: 16,
                  color: colors.subtext,
                  fontFamily: font.title,
                }}>
                If it's out of your hands, it deserves freedom from your mind
                too.
              </Text>
            </View>
          </View>
        </LinearGradient>
        {/* Prof List */}
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
            Professional's for you
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('professionaList')}>
            <Text
              style={{
                fontFamily: font.title,
                color: colors.primary,
                fontSize: 12,
              }}>
              See more
            </Text>
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
                    userName: userData.fname + ' ' + userData.lname,
                    userEmail: userData.email,
                    userAvatar: userData.userImg,
                    userRole: userData.role,
                  })
                }>
                <Animated.View style={{...styles.card, transform: [{scale}]}}>
                  <Animated.View style={{...styles.cardOverLay, opacity}} />
                  <View style={styles.Tag}>
                    <Text
                      style={{
                        color: colors.primary,
                        fontSize: 14,
                        fontFamily: font.title,
                      }}>
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
                      }}>
                      <View>
                        <Text
                          style={{
                            fontFamily: font.title,
                            fontSize: 16,
                            color: colors.text,
                          }}>
                          {Profdata ? item.fname || 'Mentlada' : 'Mentlada'}{' '}
                          {Profdata ? item.lname || 'Mentlada' : 'Mentlada'}
                        </Text>
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
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <Icon name="star" size={15} color={colors.secoundary} />
                        <Icon name="star" size={15} color={colors.secoundary} />
                        <Icon name="star" size={15} color={colors.secoundary} />
                        <Icon name="star" size={15} color={colors.secoundary} />
                        <Icon name="star" size={15} color={colors.secoundary} />
                      </View>
                      <Text style={{fontSize: 10, color: colors.subtext}}>
                        365 reviews
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          }}
          snapToInterval={cardWidth}
        />
        <Spacer size={10} />
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
                    Choose your professional
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
    height: 40,
    width: 60,
    backgroundColor: colors.w,
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
    paddingBottom: 20,
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
