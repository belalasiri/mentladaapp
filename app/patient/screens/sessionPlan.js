import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  StatusBar,
} from 'react-native';

// DataBase
import firestore, {firebase} from '@react-native-firebase/firestore';
import {AuthContext} from '../../navigation/AuthProvider';
import auth from '@react-native-firebase/auth';

//My Imports (in this case my files)
import colors from '../../config/colors';
import font from '../../config/font';
import PlansCustom from '../screens/subScreen/PlansCustom';

//Libraries
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar, Button} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import moment from 'moment';
import {COLORS, FONTS, SIZES} from '../../constants';
import {BallIndicator} from 'react-native-indicators';

const Heder = ({userImage, onBacePress, onProfilePress}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 20,
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
          session Plan
        </Text>
      </View>

      {/* Profile */}
      <TouchableOpacity
        style={{
          width: 45,
          height: 45,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onProfilePress}>
        <Avatar rounded source={userImage} />
      </TouchableOpacity>
    </View>
  );
};

const sessionPlan = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [packageData, setPackageData] = useState(0);
  const [plansData, setPlansData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [isApproved, setIsApproveddata] = useState(null);

  useLayoutEffect(() => {
    const FETCH_PLANS = firestore()
      .collection('Plans')
      // .limit(2)
      .orderBy('lastUpdated', 'desc')
      .onSnapshot(snapshot =>
        setPlansData(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
            planPrice: doc.data().planPrice,
            planType: doc.data().planType,
            planFeatures: doc.data().planFeatures,
            seconds: doc.data().seconds,
          })),
        ),
      );

    return FETCH_PLANS;
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

  useEffect(() => {
    setLoading(true);
    firestore()
      .collection('packages')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setPackageData(documentSnapshot.data().seconds);
          // console.log(packageData);
          setLoading(false);
        }
      })
      .catch(e => {
        console.log(e);
      });
  }, [packageData]);

  const onSubmitRequest = () => {
    setSubmitting(true);
    firebase
      .firestore()
      .collection('packages')
      .doc(auth().currentUser.uid)
      .set({
        RequestTime: firestore.Timestamp.fromDate(new Date()),
        UserID: auth().currentUser.uid,
        // seconds: 172800,
        planCategory: 'Free',
        approved: 'pending',
      })
      .then(() => {
        setSubmitting(false);
        // navigation.navigate('AfterReview');
      });
  };

  const checkApproval = async () => {
    await firestore()
      .collection('packages')
      .doc(auth().currentUser.uid)
      .get()
      .then(result => {
        if (result.exists) {
          setIsApproveddata(result.data().approved);
          // console.log(result.data().approved);
        } else {
          setIsApproveddata('notExist');
        }
      })
      .catch(e => {
        console.log(e);
      });

    if (loading) {
      setLoading(false);
    }
  };
  const onDelete = () => {
    setSubmitting(true);
    firebase
      .firestore()
      .collection('packages')
      .doc(auth().currentUser.uid)
      .delete()
      .then(() => {
        console.log('Your request has been cancel!');
        setSubmitting(false);
      });
  };

  useEffect(() => {
    getUser();
    checkApproval();
  }, [packageData, isApproved, submitting, loading]);

  const formatted = moment.utc(packageData * 1000).format('DD:HH:mm:ss');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <Heder
        userImage={{
          uri: userData
            ? userData.userImg || 'https://i.ibb.co/2kR5zq0/Final-Logo.png'
            : 'https://i.ibb.co/2kR5zq0/Final-Logo.png',
        }}
        onBacePress={() => navigation.goBack()}
        onProfilePress={() => navigation.navigate('Profile')}
      />
      {packageData >= 1 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 50,
          }}>
          <Image
            source={require('../../assets//image/illustrationOk1.png')}
            style={{
              height: windowHeight / 3 + 20,
              width: windowWidth / 2 + 60,
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
              You already have a plan with us
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
              Thank you for choosing to be part of Mentlada.
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: font.title,
                color: colors.w,
                textAlign: 'center',
                width: windowWidth - 120,
                lineHeight: 27,
                backgroundColor: colors.primary,
                paddingBottom: 5,
                borderRadius: 7,
                marginTop: 10,
              }}>
              You are now have {formatted}{' '}
            </Text>
          </View>
        </View>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 20,
              marginBottom: 20,
              alignItems: 'center',
              paddingTop: 10,
            }}>
            <Text
              style={{
                fontFamily: font.title,
                color: colors.text,
                fontSize: 16,
              }}>
              Choose your best plan
            </Text>
          </View>
          <FlatList
            data={plansData}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({id, item}) => (
              <PlansCustom
                item={item}
                onPlanDetailsPress={() =>
                  navigation.navigate('planDetails', {
                    HederText: item.planType,
                    Body: item.planFeatures,
                    Price: item.planPrice,
                    priceInfo: '* VAT & local taxes is applied',
                    seconds: item.seconds,
                  })
                }
              />
            )}
          />
          <View style={{margin: 20}}>
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.secondary,
                textAlign: 'center',
                marginBottom: 20,
              }}>
              We always offer free sessions for students who cannot afford the
              subscription fee or want to try out our services.
            </Text>

            {isApproved == 'notExist' ? (
              <Button
                onPress={() => navigation.navigate('FreeSession')}
                title="Request for a free session"
                titleStyle={{...FONTS.h6, color: COLORS.primary}}
                buttonStyle={{
                  borderColor: 'transparent',
                  borderWidth: 0,
                  borderRadius: 7,
                  backgroundColor: COLORS.lightpurple,
                }}
                containerStyle={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  width: SIZES.width - 40,
                }}
              />
            ) : isApproved == 'pending' ? (
              <Button
                onPress={() => onDelete()}
                title="Cancel request"
                titleStyle={{...FONTS.h6, color: COLORS.primary}}
                loading={submitting ? true : false}
                loadingProps={{
                  size: 'small',
                  color: COLORS.primary,
                }}
                buttonStyle={{
                  borderColor: 'transparent',
                  borderWidth: 0,
                  borderRadius: 7,
                  backgroundColor: COLORS.lightpurple,
                }}
                containerStyle={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  width: SIZES.width - 40,
                }}
              />
            ) : (
              <Button
                onPress={onSubmitRequest}
                loading={true}
                loadingProps={{
                  size: 'small',
                  color: COLORS.primary,
                }}
                buttonStyle={{
                  borderColor: 'transparent',
                  borderWidth: 0,
                  borderRadius: 7,
                  backgroundColor: COLORS.lightpurple,
                }}
                containerStyle={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  width: SIZES.width - 40,
                }}
              />
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default sessionPlan;

{
  /* 
  ) : isApproved == 'approved' ? (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 50,
    }}>
    <Image
      source={require('../../assets//image/illustrationOk1.png')}
      style={{
        height: windowHeight / 3 + 20,
        width: windowWidth / 2 + 60,
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
        You already have a plan with us
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
        Thank you for choosing to be part of Mentlada.
      </Text>
      <Text
        style={{
          fontSize: 15,
          fontFamily: font.title,
          color: colors.w,
          textAlign: 'center',
          width: windowWidth - 120,
          lineHeight: 27,
          backgroundColor: colors.primary,
          paddingBottom: 5,
          borderRadius: 7,
          marginTop: 10,
        }}>
        You are now have {formatted}{' '}
      </Text>
    </View>
  </View>
*/
}
