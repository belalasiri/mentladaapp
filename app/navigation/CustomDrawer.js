import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';

import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {AuthContext} from './AuthProvider';

import Notification from '../patient/screens/Notification';
import professionalList from '../patient/screens/professionalList';

import colors from '../config/colors';
import font from '../config/font';

import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-elements';
import Share from 'react-native-share';
import File from '../assets/filesBase64';

const Drawer = createDrawerNavigator();

const myCustomShare = async () => {
  const shareOptions = {
    message:
      "Come to Mentlada App, where you may get support with any mental health condition you are now experiencing. I've already completed several portions, and they were excellent; come my friend and give them a go.",
    url: File.image1,
  };

  try {
    const ShareResponse = await Share.open(shareOptions);
    console.log(JSON.stringify(ShareResponse));
  } catch (error) {
    console.log('Error => ', error);
  }
};

const CustomDrawerItems = ({label, icon, iconSize, onPress}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        height: 40,
        marginBottom: 10,
        alignItems: 'center',
        paddingLeft: 10,
        borderRadius: 7,
      }}
      onPress={onPress}>
      <Icon name={icon} size={iconSize} color={colors.subtext} />
      <Text
        style={{
          marginLeft: 15,
          color: colors.text,
          fontFamily: font.subtitle,
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const CustomDrawer = ({props, navigation, route}) => {
  const {user, logout} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
  }, [userData, user]);
  return (
    <DrawerContentScrollView
      scrollEnabled={true}
      contentContainerStyle={{flex: 1}}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 7,
        }}>
        {/* close */}
        {/* <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 15,
              }}
              onPress={() => navigation.closeDrawer()}>
              <Icon
                name="close"
                color={colors.primary}
                size={30}
                style={{paddingLeft: 10}}
              />
            </TouchableOpacity>
          </View> */}

        {/* profile */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: 15,
            paddingLeft: 10,
          }}
          onPress={() => navigation.navigate('Profile')}>
          <Avatar
            rounded
            size={60}
            source={{
              uri: userData
                ? userData.userImg ||
                  'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
            }}
          />

          <View
            style={{
              marginLeft: 15,
              // marginTop: -5,
            }}>
            <Text
              style={{
                fontFamily: font.title,
                fontSize: 18,
                color: colors.text,
              }}>
              {userData ? userData.fname || 'Mentlada' : 'Mentlada'}{' '}
              {userData ? userData.lname || 'Patient' : 'Patient'}
            </Text>
            <Text
              style={{
                fontFamily: font.subtitle,
                fontSize: 13,
                color: colors.subtext,
                marginLeft: 2,
                marginTop: -5,
              }}>
              {userData ? userData.email || 'Patient' : 'Patient'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* items */}
        <View
          style={{
            flex: 1,
            marginTop: 30,
          }}>
          <CustomDrawerItems
            label="Home"
            icon="home-outline"
            iconSize={20}
            onPress={() => navigation.navigate('Home')}
          />
          <CustomDrawerItems
            label="Profile"
            icon="person-outline"
            iconSize={20}
            onPress={() => navigation.navigate('Profile')}
          />
          <CustomDrawerItems
            label="Notification"
            icon="notifications-outline"
            iconSize={22}
            onPress={() => navigation.navigate('Notifications')}
          />
          <CustomDrawerItems
            label="Professionals"
            icon="people-outline"
            iconSize={22}
            onPress={() => navigation.navigate('professionaList')}
          />
          <CustomDrawerItems
            label="Book consultation session"
            icon="calendar-outline"
            iconSize={22}
            onPress={() => navigation.navigate('sessionPlan')}
          />
          <CustomDrawerItems
            label="Feed"
            icon="layers-outline"
            iconSize={22}
            onPress={() => navigation.navigate('Feed')}
          />
          {/* Line Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: '#e0cdf4',
              marginVertical: 10,
              marginLeft: 10,
            }}
          />
          <CustomDrawerItems
            label="Tell your friends"
            icon="heart-circle-outline"
            iconSize={25}
            onPress={myCustomShare}
          />

          <CustomDrawerItems
            label="Terms And Privacy"
            icon="shield-checkmark-outline"
            iconSize={22}
            onPress={() => navigation.navigate('TermsAndPrivacy')}
          />
          <CustomDrawerItems
            label="Help"
            icon="information-circle-outline"
            iconSize={22}
            onPress={() => navigation.navigate('Help')}
          />
        </View>
        <View
          style={{
            marginBottom: 20,
          }}>
          <CustomDrawerItems
            label="Logout"
            icon="log-out-outline"
            iconSize={22}
            onPress={() => logout()}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.w,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
