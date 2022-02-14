import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

//Libraries
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {Avatar, Button, ListItem} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {BallIndicator} from 'react-native-indicators';
import {COLORS, FONTS, icons, SIZES} from '../../constants';

const WAW = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'About Mentlada',
      headerStyle: {elevation: 0, backgroundColor: '#F0E6FA'},
      headerTitleStyle: {color: COLORS.secondary, ...FONTS.h5},
      headerTitleAlign: 'center',
      headerTintColor: COLORS.secondary,

      headerLeft: () => (
        <View style={{marginLeft: 10}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon name="chevron-back" size={25} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const Categories = [
    {
      id: 1,
      name: 'Community',
      source: icons.Community,
      desc: 'Our community seminars, podcast series and social media pages connect you with like-minded mentors and individuals working on their wellness journey.',
    },
    {
      id: 2,
      desc: 'Our community seminars, podcast series and social media pages connect you with like-minded mentors and individuals working on their wellness journey.',
      name: 'Empowerment',
      source: icons.Empowerment,
    },
    {
      id: 3,
      name: 'Inclusivity',
      desc: 'Our community seminars, podcast series and social media pages connect you with like-minded mentors and individuals working on their wellness journey.',
      source: icons.Inclusivity,
    },
  ];
  const Developers = [
    {
      id: 1,
      name: 'Belal Alqadasi',
      source: icons.Belal,
    },
    {
      id: 2,
      name: 'Hanan Alatas',
      source: icons.Hanan,
    },
  ];
  const HowMentladaWorks = [
    {
      id: 1,
      name: 'Security and Privacy',
      desc: 'We ensure that every interaction of yours at Mentlada is fully encrypted and secure. We never share your information with others. Your data is fully protected by the law.',
      source: icons.SecurityAndPrivacy,
    },
    {
      id: 2,
      name: 'Connect With Experts',
      desc: 'Choose from our extended network of counsellors and wellness specialists across the globe. Engage in confidential interactions from the comfort of your own space.',
      source: icons.ConnectWithExperts,
    },
    {
      id: 3,
      name: 'Write posts',
      desc: 'Mentlada Social connects you with like-minded mentors and individuals working on their wellness journey.',
      source: icons.WritePosts,
    },
  ];
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: COLORS.white, paddingTop: 10}}>
      <ScrollView>
        <TouchableOpacity
          style={{}}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('PatientReport')}>
          <LinearGradient
            colors={['#f7f3fc', COLORS.white]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{
              margin: 10,
              alignItems: 'flex-start',
              borderRadius: 7,
              padding: SIZES.padding * 2 - 5,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={icons.caution}
                style={{width: 20, height: 20, tintColor: COLORS.primary}}
              />
              <Text
                style={{
                  ...FONTS.h5,
                  color: COLORS.primary,
                  paddingHorizontal: 20,
                }}>
                Report a proplem
              </Text>
            </View>
            <Image
              source={icons.arrowRight}
              style={{width: 20, height: 20, tintColor: COLORS.primary}}
            />
          </LinearGradient>
        </TouchableOpacity>
        <View style={{marginTop: 10}}>
          <Text style={[styles.Title, {paddingHorizontal: 20}]}>
            How Mentlada Works
          </Text>
          <FlatList
            horizontal
            data={HowMentladaWorks}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({id, item}) => (
              <View
                style={{
                  backgroundColor: COLORS.white,
                  margin: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: SIZES.base,
                  height: 350,
                  width: SIZES.width - 80,
                  elevation: 4,
                  marginHorizontal: 15,
                }}
                key={id}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Image
                    source={item.source}
                    style={{width: 170, height: 170}}
                  />
                  <Text
                    style={{
                      ...FONTS.h3,
                      lineHeight: 50,
                      color: COLORS.secondary,
                    }}>
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.body4,
                      color: COLORS.secondary,
                      textAlign: 'center',
                      paddingHorizontal: 15,
                    }}>
                    {item.desc}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
        <View style={{paddingHorizontal: 20}}>
          <Text style={styles.Title}>Our Mission</Text>
          <Text
            style={{
              ...FONTS.h5,
              color: COLORS.secondary,
              textAlign: 'left',
              lineHeight: 40,
            }}>
            Online mental health counselling for students
          </Text>
          <Text
            style={{
              ...FONTS.body4,
              color: COLORS.secondary,
              textAlign: 'left',
              lineHeight: 30,
            }}>
            Our core aim is to fight mental health stigma to build healthy and
            thriving student communities. We offer online mental health
            depression counseling online. We want to leverage digital solutions
            to increase accessibility to quality emotional health support. We
            offer you online counseling for safe, convenient and personalised
            care.
          </Text>
        </View>
        <View style={{}}>
          <Text style={[styles.Title, {paddingHorizontal: 20, marginTop: 30}]}>
            Our Values
          </Text>
          <FlatList
            horizontal
            data={Categories}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({id, item}) => (
              <View
                style={{
                  backgroundColor: COLORS.white,
                  margin: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: SIZES.base,
                  height: 350,
                  width: SIZES.width - 80,
                  elevation: 4,
                  marginHorizontal: 15,
                }}
                key={id}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Image
                    source={item.source}
                    style={{width: 170, height: 170}}
                  />
                  <Text
                    style={{
                      ...FONTS.h3,
                      lineHeight: 50,
                      color: COLORS.secondary,
                    }}>
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.body4,
                      color: COLORS.secondary,
                      textAlign: 'center',
                      paddingHorizontal: 15,
                    }}>
                    {item.desc}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text style={[styles.Title, {paddingHorizontal: 20}]}>
            Our Developers
          </Text>
          <FlatList
            horizontal
            data={Developers}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({id, item}) => (
              <View style={{flexDirection: 'column'}} key={id}>
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    margin: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: SIZES.base,
                    height: 240,
                    width: SIZES.width / 2,
                    elevation: 4,
                    marginHorizontal: 10,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={item.source}
                      style={{
                        width: 170,
                        height: 170,
                        borderRadius: SIZES.base,
                      }}
                    />
                    <Text
                      style={{
                        ...FONTS.h4_2,
                        color: COLORS.secondary,
                        paddingTop: 15,
                      }}>
                      {item.name}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WAW;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Title: {
    ...FONTS.h2,
    color: COLORS.secondary,
    lineHeight: 50,
    textAlign: 'left',
  },
});
