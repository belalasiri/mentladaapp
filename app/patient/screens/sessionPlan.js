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

//My Imports (in this case my files)
import colors from '../../config/colors';
import font from '../../config/font';
import PlansCustom from '../screens/subScreen/PlansCustom';

//Libraries
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import moment from 'moment';
import {COLORS} from '../../constants';
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

const AllPlans = [
  {
    id: 1,
    HederText: 'Premium',
    Body: '- +10000 minutes of consulting',
    Body2: '- Chat',
    Price: 'RM70',
    seconds: 604800,

    priceInfo: '* VAT & local taxes is applied',
  },
  {
    id: 2,
    HederText: 'Basic',
    Body: '- +4300 minutes of consulting',
    Body2: '- Chat',
    Price: 'RM30',
    seconds: 259200,
    priceInfo: '* VAT & local taxes is applied',
  },
];

const sessionPlan = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [packageData, setPackageData] = useState(0);
  const [plansData, setPlansData] = useState([]);

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
          console.log(packageData);
        }
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  }, [packageData]);

  useEffect(() => {
    getUser();
    // getPackage();
    // console.log(formatted);
  }, [user, packageData]);

  const Content = ({HederText, Body, Body2, Price, priceInfo, onPress}) => {
    return (
      <>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingLeft: 15,
            }}>
            <Text
              style={{
                fontSize: 15,
                color: colors.text,
                fontFamily: font.title,
              }}>
              {HederText}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.subtext,
                fontFamily: font.subtitle,

                textAlign: 'center',
              }}>
              {Body}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.subtext,
                fontFamily: font.subtitle,

                textAlign: 'center',
              }}>
              {Body2}
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: colors.text,
                fontFamily: font.title,
                textAlign: 'center',
              }}>
              {Price}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: colors.subtext,
                fontFamily: font.title,
                textAlign: 'center',
              }}>
              {priceInfo}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              style={{
                borderRadius: 7,
                padding: 10,
                backgroundColor: '#c19ce9',
              }}
              onPress={onPress}>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.w,
                  fontFamily: font.title,
                }}>
                Subscribe now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };
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
            ? userData.userImg ||
              'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
            : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
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
          {/* <FlatList
            data={AllPlans}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({id, item}) => (
              <View>
                <LinearGradient
                  colors={['#f7f3fc', '#fff', '#f7f3fc']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 15,
                    marginVertical: 5,
                    alignItems: 'center',
                    borderRadius: 7,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      marginHorizontal: 5,
                    }}>
                    {item.HederText == 'Premium' ? (
                      <View
                        style={{
                          backgroundColor: colors.primary,
                          width: windowWidth / 2 - 20,
                          borderBottomRightRadius: 30,
                          borderTopRightRadius: 30,
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            fontFamily: font.title,
                            color: colors.w,
                            fontSize: 16,
                            paddingLeft: 20,
                          }}>
                          Best value
                        </Text>
                      </View>
                    ) : null}

                    <View style={{padding: 10}}>
                      <Content
                        HederText={item.HederText}
                        Body={item.Body}
                        Body2={item.Body2}
                        Price={item.Price}
                        priceInfo={item.priceInfo}
                        onPress={() =>
                          navigation.navigate('planDetails', {
                            HederText: item.HederText,
                            Body: item.Body,
                            Body2: item.Body2,
                            Price: item.Price,
                            priceInfo: item.priceInfo,
                            seconds: item.seconds,
                          })
                        }
                      />
                    </View>
                  </View>
                </LinearGradient>
              </View>
            )}
          /> */}
        </>
      )}
    </SafeAreaView>
  );
};

export default sessionPlan;
