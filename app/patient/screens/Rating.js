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
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {COLORS, FONTS, icons, SIZES} from '../../constants';

//Libraries
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {Avatar, Button, ListItem} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import BlogCustom from './subScreen/BlogCustom';

const Rating = ({route, navigation}) => {
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     title: 'Write a review',
  //     headerStyle: {elevation: 0, backgroundColor: '#F0E6FA'},
  //     headerTitleStyle: {color: COLORS.secondary, ...FONTS.h5},
  //     headerTitleAlign: 'center',
  //     headerTintColor: COLORS.secondary,

  //     headerLeft: () => (
  //       <View style={{marginLeft: 10}}>
  //         {/* <TouchableOpacity
  //           activeOpacity={0.5}
  //           onPress={() => {
  //             navigation.goBack();
  //           }}>
  //           <Icon name="exit-outline" size={25} color={COLORS.secondary} />
  //         </TouchableOpacity> */}
  //       </View>
  //     ),
  //   });
  // }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />

      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={80}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View
              style={{
                flex: 1,
                justifyContent: 'space-between',
                alignSelf: 'center',
              }}>
              <View
                style={{
                  alignItems: 'center',
                  paddingTop: 50,
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    width: '90%',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      ...FONTS.h5,
                      color: COLORS.secondary,
                      textAlign: 'center',
                    }}>
                    Session Ended...
                  </Text>
                  <Text
                    style={{
                      ...FONTS.body5,
                      color: COLORS.secondary,
                      textAlign: 'center',
                      marginTop: 10,
                    }}>
                    You can come back to consult Dr.
                    {route.params.professionalName} or any other professional at
                    any time as long as you have a valid plan with us.
                  </Text>
                </View>
              </View>

              <View style={{alignItems: 'center', marginTop: -60}}>
                <Avatar
                  rounded
                  size={120}
                  source={{
                    uri:
                      route.params.professionalAvatar ||
                      'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      ...FONTS.h5,
                      color: COLORS.secondary,
                      paddingTop: SIZES.padding,
                    }}>
                    Dr.{route.params.professionalName}
                  </Text>
                  {route.params.isProfessionalVerified ==
                  'notVerified' ? null : route.params.isProfessionalVerified ==
                    'Verified' ? (
                    <View
                      style={{
                        paddingTop: 13,
                      }}>
                      <Image
                        source={icons.verifiedUser}
                        style={{
                          width: 13,
                          height: 13,
                          marginLeft: 3,
                          tintColor: COLORS.primary,
                        }}
                      />
                    </View>
                  ) : null}
                </View>
                <Text
                  style={{
                    ...FONTS.h6,
                    color: COLORS.secondary,
                    paddingTop: SIZES.padding,
                  }}>
                  Session Id
                </Text>
                <Text
                  style={{
                    ...FONTS.h7,
                    color: COLORS.primary,
                    letterSpacing: 0.6,
                    // paddingTop: SIZES.padding,
                  }}>
                  {route.params.isRequested}
                </Text>
              </View>

              <View
                style={{
                  width: '95%',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginVertical: 20,
                  marginBottom: 20,
                  alignSelf: 'center',
                }}>
                <LinearGradient
                  colors={[COLORS.green, COLORS.lightGreen]}
                  start={{x: 0.5, y: 3.0}}
                  end={{x: 0.25, y: 0}}
                  style={{
                    alignItems: 'center',
                    borderRadius: 7,
                    margin: 5,
                  }}>
                  <Button
                    onPress={() => navigation.navigate('Home')}
                    title="Back to home"
                    titleStyle={{...FONTS.h6, color: COLORS.secondary}}
                    buttonStyle={{
                      backgroundColor: 'transparent',
                      borderColor: 'transparent',
                      borderWidth: 0,
                      borderRadius: 7,
                    }}
                    containerStyle={{
                      width: SIZES.width / 3 + 35,
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}
                  />
                </LinearGradient>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.emerald]}
                  start={{x: 0.5, y: 6.0}}
                  end={{x: 0.0, y: 0.25}}
                  style={{
                    alignItems: 'center',
                    borderRadius: 7,
                    margin: 5,
                  }}>
                  <Button
                    onPress={() =>
                      navigation.navigate('RatingTheProfessional', {
                        professionalId: route.params.professionalId,
                      })
                    }
                    title="Write a review"
                    titleStyle={{...FONTS.h6, color: COLORS.secondary}}
                    buttonStyle={{
                      backgroundColor: 'transparent',
                      borderColor: 'transparent',
                      borderWidth: 0,
                      borderRadius: 7,
                    }}
                    containerStyle={{
                      width: SIZES.width / 3 + 35,
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}
                  />
                </LinearGradient>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Rating;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    width: '100%',
    padding: 15,
  },
});
