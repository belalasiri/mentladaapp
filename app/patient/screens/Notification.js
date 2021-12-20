import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
} from 'react-native';

// DataBase
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../navigation/AuthProvider';

//My Imports (in this case my files)
import colors from '../../config/colors';
import font from '../../config/font';

//Libraries
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

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
          Notification
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

const Content = ({HederText, Body, professionalExperience}) => {
  return (
    <>
      <View>
        <Text
          style={{fontSize: 15, color: colors.text, fontFamily: font.title}}>
          {HederText}
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
            {Body}
          </Text>
        </View>
      </View>
    </>
  );
};

const Notification = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [approved, setApproved] = useState(true);
  const [loading, setLoading] = useState(true);

  //// patients who are aproved for a session
  let approvedList = [];
  const fetchapprovedUsers = async () => {
    await firestore()
      .collection('session')
      .where('approved', '==', 'approved')
      .where('profEmail', '==', user.email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          approvedList.push({
            id: doc.id,
            approved: doc.data().approved,
            isRequested: doc.data().isRequested,
            patientName: doc.data().patientName,
            patientEmail: doc.data().patientEmail,
            patientAvatar: doc.data().patientAvatar,
            professionalName: doc.data().professionalName,
            profEmail: doc.data().profEmail,
            professionalAvatar: doc.data().professionalAvatar,
          });
        });
      })
      .catch(e => {
        console.log(e);
      });
    setApproved(approvedList);

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
    fetchapprovedUsers();
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

      <TouchableOpacity
        // onPress={() => navigation.navigate('ProfProfile')}
        onPress={() => navigation.navigate('sessionPlan')}>
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
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-start',
              justifyContent: 'center',
              marginHorizontal: 20,
            }}>
            <Content
              HederText="You have been approved 🎉"
              Body="Your request for a consultation with one of our profitionals has been approved, plese proceed with the payment"
            />
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

      <FlatList
        data={approved}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            // onPress={() => navigation.navigate('ProfProfile')}
            onPress={() => navigation.navigate('sessionPlan')}>
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
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  marginHorizontal: 20,
                }}>
                <Content
                  HederText="You have been approved 🎉"
                  Body="Your request for a consultation with one of our profitionals has been approved, plese proceed with the payment"
                />
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
        )}
      />
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
