import React, {useState, useEffect, useContext} from 'react';
import {View, SafeAreaView, TouchableOpacity, Text, Image} from 'react-native';

// DataBase
import firestore, {firebase} from '@react-native-firebase/firestore';
import {AuthContext} from '../../navigation/AuthProvider';

//My Imports (in this case my files)
import colors from '../../config/colors';
import font from '../../config/font';

//Libraries
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {windowWidth} from '../../utils/Dimentions';

const Heder = ({userImage, onBacePress, onProfilePress}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 15,
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

const Content = ({HederText, Body, Body2, Price, priceInfo}) => {
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
            style={{fontSize: 15, color: colors.text, fontFamily: font.title}}>
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
            }}>
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

const sessionPlan = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

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
    getUser();
  }, [user]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
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
      <View
        // onPress={() => navigation.navigate('ProfProfile')}
        onPress={() => {}}>
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
            <View style={{padding: 10}}>
              <Content
                HederText="Premium"
                Body="- 8000 minutes of consulting"
                Body2="- Chat with video"
                Price="RM150"
                priceInfo="* VAT & local taxes may apply"
              />
            </View>
          </View>
        </LinearGradient>
      </View>

      <View
        // onPress={() => navigation.navigate('ProfProfile')}
        onPress={() => {}}>
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
            padding: 10,
          }}>
          <View
            style={{
              flex: 1,
              // alignItems: 'flex-start',
              justifyContent: 'center',
              marginHorizontal: 5,
            }}>
            <Content
              HederText="Basic"
              Body="- 1000 minutes of consulting"
              Body2="- Chat with video"
              Price="RM50"
              priceInfo="* VAT & local taxes may apply"
            />
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

export default sessionPlan;
