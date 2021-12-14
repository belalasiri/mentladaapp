import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import colors from '../../config/colors';
import font from '../../config/font';

import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../navigation/AuthProvider';
import ProfilePic from '../../config/components/Blog/ProfilePic';

import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {Avatar, ListItem} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import {TouchableOpacity} from 'react-native-gesture-handler';
import moment from 'moment';

const BlogContent = ({navigation, route}) => {
  let blogTime = (
    <Text>{moment(route.params.blogTime.toDate()).fromNow()}</Text>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="default"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <ScrollView>
        {/* Header */}
        <View style={{flex: 2}}>
          <Image
            source={{
              uri:
                route.params.blogtImg ||
                'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
            }}
            resizeMode="cover"
            style={{
              width: windowWidth,
              height: windowHeight / 3 - 10,
            }}
          />
        </View>
        <View
          style={{
            alignItems: 'flex-start',
            position: 'absolute',
            top: 30,
            left: 20,
            right: 20,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 25,
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}>
            <Icon
              name="arrow-back"
              size={22}
              color={colors.w}
              onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>
        </View>
        {/* Author Continer */}
        <View style={{flex: 2}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Avatar
                rounded
                size={50}
                source={{
                  uri:
                    route.params.professionalAvatar ||
                    'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
                }}
              />
              <View
                style={{
                  paddingHorizontal: 15,
                }}>
                <Text style={styles.text}>
                  Written by {route.params.professionalName}
                </Text>
                <Text style={styles.text}>Last updated {blogTime}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 25,
                // backgroundColor: 'rgba(0,0,0,0.2)',
              }}>
              <Icon name="heart-outline" size={25} color={colors.subtext} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Blog content */}
        <View style={{flex: 2}}>
          {/* Title */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.text,
                lineHeight: 30,
                fontFamily: font.title,
                width: windowWidth / 2 + 120,
              }}>
              {route.params.Blog}
            </Text>
            <Text
              style={{
                paddingVertical: 15,
                fontSize: 14,
                color: colors.subtext,
                lineHeight: 28,
                fontFamily: font.subtitle,
              }}>
              {route.params.Content}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default BlogContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
