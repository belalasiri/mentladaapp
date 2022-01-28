import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {AuthContext} from '../../navigation/AuthProvider';

import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Pressable,
} from 'react-native';
import {COLORS, FONTS, SIZES, icons} from '../../constants';

import Icon from 'react-native-vector-icons/Ionicons';
import FormButton from '../../config/components/FormButton';
import colors from '../../config/colors';
import font from '../../config/font';
import ProfInfo from '../../config/components/ProfInfo';
import SpecialityCard from '../../config/components/SpecialityCard';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ImageBackground} from 'react-native';

const ProfProfile = ({route, item, navigation}) => {
  const {user, Proflogout} = useContext(AuthContext);
  const [profData, setProfData] = useState(null);
  const [profPationts, setprofPationts] = useState();
  const [loading, setLoading] = useState(true);
  const [isVerified, setVerified] = useState(null);
  const [professionalRating, setProfessionalRating] = useState([]);

  const getUser = async () => {
    await firestore()
      .collection('Professional')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          // console.log('User Data', documentSnapshot.data());
          setProfData(documentSnapshot.data());
        }
      });
  };

  const checkApproval = async () => {
    await firestore()
      .collection('Professional')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(result => {
        if (result.exists) {
          setVerified(result.data().Verified);
          // console.log(result.data().Verified);
        } else {
          setVerified('notVerified');
        }
      })
      .catch(e => {
        console.log(e);
      });
    if (loading) {
      setLoading(false);
    }
  };
  useLayoutEffect(() => {
    const getProfessionalRaiting = firestore()
      .collection('Professional')
      .doc(route.params ? route.params.userId : user.uid)
      .collection('Rating')
      .orderBy('ReviewTime', 'desc')
      .onSnapshot(snapshot =>
        setProfessionalRating(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ReviewerId: doc.data().ReviewerId,
            ReviewContent: doc.data().ReviewContent,
            ReviewTime: doc.data().ReviewTime,
            Review: doc.data().Review,
          })),
        ),
      );

    return getProfessionalRaiting;
  }, [navigation]);
  let approvedPatientsList = [];
  const fetchapprovedPatients = async () => {
    await firestore()
      .collection('session')
      .where('approved', '==', 'approved')
      .where('profEmail', '==', user.email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const {isRequested} = doc.data();
          approvedPatientsList.push({
            id: doc.id,
            isRequested,
          });
        });
      })
      .catch(e => {
        console.log(e);
      });
    setprofPationts(approvedPatientsList);

    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
    checkApproval();
    fetchapprovedPatients();
  }, [profData]);
  let starRatings = 0;
  professionalRating.forEach(item => {
    starRatings += item.Review / professionalRating.length;
  });
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      {/* Profile pic and name with Specialty */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="rgba(0,0,0,0)"
        />
        <View style={styles.Heder}>
          <View style={styles.Left} />
          <View style={styles.Right} />
        </View>
        <View style={{paddingHorizontal: 15}}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginRight: 15,
              paddingTop: 50,
            }}
            activeOpacity={1}
            onPress={() => navigation.navigate('WAW')}>
            <Image
              source={icons.info}
              style={{width: 20, height: 20, tintColor: COLORS.primary}}
            />
            {/* <Image source={icons.info} style={{width: 20, height: 20}} /> */}
          </TouchableOpacity>
          <View style={styles.Hedercontainer}>
            <Image
              style={styles.ProfileImage}
              source={{
                uri: profData
                  ? profData.userImg ||
                    'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg'
                  : 'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
              }}
            />

            {/* Profile name and Specialty */}
            <View style={{alignItems: 'center'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.title,
                    paddingTop: 10,
                    color: colors.text,
                  }}>
                  {profData ? profData.fname || 'Professional' : 'Professional'}{' '}
                  {profData ? profData.lname || 'Profile' : 'Profile'}
                </Text>

                {isVerified == 'notVerified' ? null : isVerified ==
                  'Verified' ? (
                  <View
                    style={{
                      paddingTop: 12,
                    }}>
                    <Image
                      source={icons.verifiedUser}
                      style={{
                        width: 20,
                        height: 20,
                        marginLeft: 5,
                        tintColor: COLORS.primary,
                      }}
                    />
                  </View>
                ) : null}
              </View>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: font.subtitle,
                  color: colors.primary,
                }}>
                {profData
                  ? profData.specialization || 'Mentlada'
                  : 'Spacialist'}
              </Text>
            </View>
          </View>

          <View style={styles.userBtnWrapper}>
            {route.params ? (
              <>
                {route.params.userId !== auth().currentUser.uid ? null : null}
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.userBtn_E}
                  onPress={() => {
                    navigation.navigate('EditProfile');
                  }}>
                  <Text style={styles.userBtnTxt}>Edit profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.userBtn_L}
                  onPress={() => Proflogout()}>
                  <Text style={styles.userBtnTxt}>Logout</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Prof info continer */}
          <View style={{flexDirection: 'row', paddingTop: SIZES.padding}}>
            <LinearGradient
              colors={[COLORS.lightpurple, COLORS.lightyellow]}
              start={{x: 0.5, y: 2.0}}
              end={{x: 0.0, y: 0.25}}
              style={{
                marginVertical: 5,
                alignItems: 'center',
                borderRadius: 7,
                flex: 1,
                margin: 5,
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ReviewsList', {
                    professionalId: user.uid,
                    profName: user.email,
                  })
                }>
                <View
                  style={{
                    alignItems: 'center',
                    borderRadius: 7,
                    paddingTop: 10,
                    paddingBottom: 10,
                    justifyContent: 'center',
                  }}>
                  <Icon name="star" size={20} color={COLORS.yellow} />
                  {starRatings ? (
                    <View
                      style={{
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        flexDirection: 'row',
                      }}>
                      {starRatings == 5 ? (
                        <Text
                          style={{
                            ...FONTS.h5,
                            color: COLORS.secondary,
                            textAlign: 'center',
                          }}>
                          {starRatings}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            ...FONTS.h5,
                            color: COLORS.secondary,
                            textAlign: 'center',
                          }}>
                          {starRatings.toFixed(1)}
                        </Text>
                      )}
                      <Text
                        style={{
                          ...FONTS.h7,
                          color: COLORS.primary,
                          marginTop: 5,
                        }}>
                        /5
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={{
                        ...FONTS.h7,
                        width: 100,
                        textAlign: 'center',
                        marginTop: 5,
                      }}>
                      No Ratings Yet
                    </Text>
                  )}
                  <Text style={{...FONTS.body5}}>Reviews</Text>
                </View>
              </TouchableOpacity>
            </LinearGradient>
            <LinearGradient
              colors={[COLORS.lightpurple, COLORS.lightGreen]}
              start={{x: 0.5, y: 2.0}}
              end={{x: 0.0, y: 0.25}}
              style={{
                marginVertical: 5,
                alignItems: 'center',
                borderRadius: 7,
                margin: 5,
                flex: 1,
              }}>
              <ProfInfo
                icon="person"
                iconColor={COLORS.green}
                // backgroundColor="#e1f7ef"
                Title1={profPationts ? profPationts.length || '0' : null}
                Title2="Patients"
              />
            </LinearGradient>
            <LinearGradient
              colors={[COLORS.lightpurple, COLORS.emerald]}
              start={{x: 0.5, y: 2.0}}
              end={{x: 0.0, y: 0.25}}
              style={{
                marginVertical: 5,
                alignItems: 'center',
                borderRadius: 7,
                margin: 5,
                flex: 1,
              }}>
              <ProfInfo
                icon="checkmark-done-circle"
                iconColor={COLORS.lime}
                Title1={profData ? profData.Experience || 'New' : 'Spacialist'}
                Title2="Experience"
              />
            </LinearGradient>
          </View>
          <View style={{paddingTop: 15}}>
            {route.params ? (
              <>
                {route.params.userId !== auth().currentUser.uid ? (
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: font.title,
                        color: colors.text,
                      }}>
                      About{' '}
                      {profData
                        ? profData.fname || 'Professional'
                        : 'Professional'}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: font.subtitle,
                        color: colors.subtext,
                        paddingTop: 5,
                      }}>
                      {profData
                        ? profData.about || 'No deteiles are provided..'
                        : 'No deteiles are provided..'}
                    </Text>
                  </View>
                ) : null}
              </>
            ) : (
              <>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.title,
                    color: colors.text,
                  }}>
                  About you
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: font.subtitle,
                    color: colors.subtext,
                    paddingTop: 5,
                  }}>
                  {profData
                    ? profData.about ||
                      'There are no details provided. By editing your profile, you may add an About you information.'
                    : 'There are no details provided. By editing your profile, you may add an About you information.'}
                </Text>
              </>
            )}
          </View>
          <LinearGradient
            colors={[COLORS.lightpurple, COLORS.lightGreen]}
            start={{x: 0, y: 1}}
            end={{x: 0, y: 0}}
            style={{
              marginVertical: 5,
              alignItems: 'center',
              justifyContent: 'center',

              borderRadius: 7,
              marginTop: 15,
              padding: 10,
            }}>
            <View
              style={{
                margin: SIZES.padding,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="document-text" size={25} color="#6D768E" />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{...FONTS.h5, color: COLORS.secondary}}>LPC </Text>
                <Text style={{...FONTS.h5, color: COLORS.primary}}>
                  {profData
                    ? profData.License || 'This Professional has No License'
                    : 'This Professional has No License'}
                </Text>
              </View>
              <Text style={{...FONTS.body4, color: COLORS.secondary}}>
                License
              </Text>
            </View>
          </LinearGradient>

          <View style={{paddingTop: 15}}>
            <Text
              style={{
                ...FONTS.h4,
                textAlign: 'left',
                color: COLORS.secondary,
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}>
              Licensed professional counselor certification
            </Text>
            <Pressable
              onPress={() => navigation.navigate('LicenseCertificate')}>
              <LinearGradient
                colors={[COLORS.lightpurple, COLORS.lightGreen]}
                start={{x: 0, y: 1}}
                end={{x: 0, y: 0}}
                style={{
                  marginVertical: 5,
                  alignItems: 'center',
                  justifyContent: 'center',

                  borderRadius: 7,
                  marginTop: 15,
                  padding: 10,
                }}>
                <ImageBackground
                  source={{
                    uri: profData
                      ? profData.LicenseCertificate ||
                        'https://i.ibb.co/YjC43xX/uploading.jpg'
                      : 'https://i.ibb.co/YjC43xX/uploading.jpg',
                  }}
                  style={{
                    width: 300,
                    height: 200,
                  }}
                  blurRadius={5}
                  imageStyle={{
                    borderRadius: 7,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {/* <MaterialCommunityIcons
                      name="camera"
                      size={50}
                      color={COLORS.secondary}
                      style={{
                        opacity: 0.7,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: COLORS.secondary,
                        borderRadius: 7,
                      }}
                    /> */}
                    <Text
                      style={{
                        ...FONTS.h4_2,
                        textAlign: 'center',
                        color: COLORS.secondary,
                      }}>
                      Tap to change the certificate
                    </Text>
                  </View>
                </ImageBackground>
              </LinearGradient>
            </Pressable>
          </View>

          <View style={{paddingTop: 15}}>
            <Text
              style={{
                ...FONTS.h4,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 7,
                color: COLORS.secondary,
              }}>
              Specialities
            </Text>
            <View style={{flexDirection: 'row'}}>
              <ScrollView horizontal>
                <SpecialityCard
                  text={profData ? profData.Specialty || ' ' : ' '}
                />
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfProfile;

const styles = StyleSheet.create({
  Heder: {
    position: 'absolute',
    width: '100%',
    top: -50,
    zIndex: -100,
  },
  Left: {
    backgroundColor: COLORS.lightyellow,
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    left: -30,
    top: -30,
  },
  Right: {
    backgroundColor: COLORS.lightpurple,
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    right: -100,
    top: -200,
  },
  Hedercontainer: {
    alignItems: 'center',
    paddingTop: 30,
  },
  ProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 70,
  },
  ProfCont: {
    flexDirection: 'row',
    paddingTop: 15,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 3,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  cardText: {
    fontSize: 14,
  },

  userBtnTxt: {
    textAlign: 'center',
    color: colors.subtext,
  },

  userBtn_L: {
    flex: 1,
    borderColor: '#dedede',
    backgroundColor: '#dedede3b',
    borderWidth: 1,
    borderRadius: 7,
    paddingVertical: 8,
    marginHorizontal: 2,
    marginTop: 10,
  },
  userBtn_E: {
    flex: 3,
    borderColor: '#dedede',
    borderWidth: 1,
    borderRadius: 7,
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 2,
    marginTop: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
