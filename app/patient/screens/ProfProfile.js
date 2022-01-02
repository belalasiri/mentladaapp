import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import FormButton from '../../config/components/FormButton';
import colors from '../../config/colors';
import font from '../../config/font';
import ProfInfo from '../../config/components/ProfInfo';
import SpecialityCard from '../../config/components/SpecialityCard';

import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../navigation/AuthProvider';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {ToastAndroid} from 'react-native';
import {COLORS, FONTS, icons, SIZES} from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
import {BallIndicator, BarIndicator} from 'react-native-indicators';
import AwesomeAlert from 'react-native-awesome-alerts';

const ProfProfile = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [Profdata, setProfdata] = useState(null);
  const [isApproved, setIsApproveddata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [profPationts, setprofPationts] = useState();
  const [isVerified, setVerified] = useState(null);
  const [isReloading, setReloading] = useState(false);

  let profList = [];
  const fetchProf = async () => {
    await firestore()
      .collection('Professional')
      .where('patientEmail', '==', user.email)
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

  const checkApproval = async () => {
    await firestore()
      .collection('session')
      .doc(auth().currentUser.email + route.params.profEmail)
      .get()
      .then(result => {
        if (result.exists) {
          setIsApproveddata(result.data().approved);
          console.log(result.data().approved);
          // setReloading(false);
        } else {
          setIsApproveddata('notExist');
          // setReloading(false);
        }
      })
      .catch(e => {
        console.log(e);
      });

    if (loading) {
      setLoading(false);
    }
    // setReloading(false);
  };

  const checkVerified = async () => {
    await firestore()
      .collection('Professional')
      .doc(route.params.professionalId)
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

  useEffect(() => {
    checkApproval();
    checkVerified();
    getUser();
    fetchapprovedPatients();
    fetchProf();
  }, [isApproved, user, loading]);

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

  const onRequest = () => {
    setReloading(true);

    firebase
      .firestore()
      .collection('session')
      .doc(auth().currentUser.email + route.params.profEmail)
      .set({
        approved: 'pending',
        isRequested: route.params.userEmail + route.params.profEmail,
        patientName: route.params.userName,
        patientEmail: route.params.userEmail,
        patientAvatar: route.params.userAvatar,
        professionalName: route.params.profName,
        profEmail: route.params.profEmail,
        professionalAvatar: route.params.profAvatar,
        professionalId: route.params.professionalId,
        isProfessionalVerified: route.params.Verified,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        setLoading(true);
        setReloading(false);

        console.log('Request Sent!');
        Alert.alert(
          'Request Sent!',
          'Your Request has sent successfully. please wait for the profissinal to approve you request. Thank you',
        );
      });
  };
  const onDelete = () => {
    setReloading(true);

    firebase
      .firestore()
      .collection('session')
      .doc(auth().currentUser.email + route.params.profEmail)
      .delete()
      .then(() => {
        console.log('Your request has been cancel!');
        setLoading(true);
        setReloading(false);

        Alert.alert('Request Cenceled!', '');
      });
  };

  const onCancel = () => {
    navigation.goBack();
    ToastAndroid.showWithGravityAndOffset(
      'Add post Canceled',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      0,
      200,
    );
  };

  let approvedPatientsList = [];
  const fetchapprovedPatients = async () => {
    await firestore()
      .collection('session')
      .where('approved', '==', 'approved')
      .where('profEmail', '==', route.params.profEmail)
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

        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Icon
              name="chevron-back"
              size={25}
              color={colors.subtext}
              style={{paddingVertical: 10}}
            />
          </TouchableOpacity>
        </View>

        <View style={{paddingHorizontal: 15}}>
          <View style={styles.Hedercontainer}>
            {/* Profile pic */}
            <Image
              style={styles.ProfileImage}
              source={{
                uri: Profdata
                  ? route.params.profAvatar ||
                    'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg'
                  : 'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
              }}
              // source={require('../../assets/image/users/user_1.jpg')}
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
                  {route.params.profName}
                </Text>
                {isVerified == 'notVerified' ? null : isVerified ==
                  'Verified' ? (
                  <View
                    style={{
                      paddingTop: 13,
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
                  fontSize: 12,
                  fontFamily: font.subtitle,
                  color: colors.primary,
                }}>
                {route.params.profSpecialty}
              </Text>
            </View>
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
              <ProfInfo
                icon="star"
                iconColor={COLORS.yellow}
                Title1="4.98"
                Title2="Reviews"
              />
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
                iconColor="#67d8af"
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
                iconColor="#61edea"
                // backgroundColor="#dffbfb"
                Title1={route.params.profExperience}
                Title2="Experience"
              />
            </LinearGradient>
          </View>
          <View style={{paddingTop: 15, paddingHorizontal: 10}}>
            <Text
              style={{
                ...FONTS.h4,
                paddingTop: SIZES.padding,
                width: SIZES.width / 2 + 30,
                color: COLORS.secondary,
                flexWrap: 'wrap',
              }}>
              Professionals for you
            </Text>
            <Text
              style={{
                ...FONTS.body4,
                paddingTop: 5,
              }}>
              {route.params.profAbout
                ? route.params.profAbout || 'No deteiles are provided..'
                : 'No deteiles are provided..'}
            </Text>
          </View>
          <LinearGradient
            colors={[COLORS.lightpurple, COLORS.lightGreen]}
            start={{x: 0, y: 1}}
            end={{x: 0, y: 0}}
            style={{
              marginVertical: 5,
              alignItems: 'center',
              borderRadius: 7,
              marginTop: 15,
              padding: 10,
            }}>
            <View style={{margin: SIZES.padding, alignItems: 'center'}}>
              <Icon name="document-text" size={25} color="#6D768E" />

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{...FONTS.h5, color: COLORS.secondary}}>LPC </Text>
                <Text style={{...FONTS.h5, color: COLORS.primary}}>
                  {route.params.profLicense}
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
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 7,
                color: COLORS.secondary,
              }}>
              Specialities
            </Text>
            <View style={{flexDirection: 'row'}}>
              <ScrollView horizontal>
                <SpecialityCard text={route.params.profSpecialty} />
              </ScrollView>
            </View>
          </View>
          <View style={{marginBottom: 10}}>
            {isApproved == 'notExist' ? (
              <LinearGradient
                colors={[COLORS.lightpurple, COLORS.lightGreen]}
                start={{x: 0, y: 1}}
                end={{x: 0, y: 0}}
                style={{
                  marginTop: 10,
                  paddingBottom: 3,
                  width: '100%',
                  height: SIZES.height / 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 7,
                }}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => onRequest()}>
                  {isReloading ? (
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <BallIndicator color={COLORS.secondary} size={15} />
                    </View>
                  ) : (
                    <Text
                      style={[styles.buttonText, {color: COLORS.secondary}]}>
                      Request for a counselling session
                    </Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            ) : isApproved == 'pending' ? (
              <LinearGradient
                colors={[COLORS.lightyellow, COLORS.lightGreen]}
                start={{x: 0, y: 1}}
                end={{x: 0, y: 0}}
                style={{
                  marginTop: 10,
                  paddingBottom: 3,
                  width: '100%',
                  height: SIZES.height / 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 7,
                }}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => onDelete()}>
                  {isReloading ? (
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <BallIndicator color={COLORS.secondary} size={15} />
                    </View>
                  ) : (
                    <Text
                      style={[styles.buttonText, {color: COLORS.secondary}]}>
                      Cancel the request
                    </Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            ) : isApproved == 'approved' ? (
              <LinearGradient
                colors={[COLORS.lightGreen, COLORS.green]}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 3}}
                style={{
                  marginTop: 10,
                  paddingBottom: 3,
                  width: '100%',
                  height: SIZES.height / 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 7,
                }}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => navigation.navigate('Message')}>
                  {isReloading ? (
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <BallIndicator color={COLORS.white} size={15} />
                    </View>
                  ) : (
                    <Text
                      style={[styles.buttonText, {color: COLORS.secondary}]}>
                      Chat
                    </Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            ) : (
              <LinearGradient
                colors={[COLORS.lightpurple, COLORS.primary]}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 3}}
                style={{
                  marginTop: 10,
                  paddingBottom: 3,
                  width: '100%',
                  height: SIZES.height / 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 7,
                }}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <BarIndicator color={COLORS.secondary} size={20} />
                </TouchableOpacity>
              </LinearGradient>
            )}
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
    paddingTop: 20,
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
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingLeft: 20,
  },

  cancelButton: {
    borderRadius: 40,
  },
  buttonContainer: {},
  buttonText: {
    ...FONTS.h5,
  },
});
