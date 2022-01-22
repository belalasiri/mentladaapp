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
import {AirbnbRating} from 'react-native-elements';

import {COLORS, FONTS, icons, SIZES} from '../../../constants';
const RatingTheProfessional = ({navigation, route}) => {
  const [professionalData, setProfessionalData] = useState([]);
  const [professionalRating, setProfessionalRating] = useState(null);
  const [profData, setProfData] = useState(null);
  const [ratingData, setRatingData] = React.useState(0);
  const [loading, setLoading] = useState(true);
  const [isVerified, setVerified] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [defaultRating, setDefaultRating] = useState(5);
  const [maxRating] = useState([1, 2, 3, 4, 5]);
  const [submitting, setSubmitting] = useState(false);
  const [review, setReview] = useState(null);

  const starImgFilled =
    'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
  const starImgCorner =
    'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Write a review',
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

  const getProfessional = async () => {
    await firestore()
      .collection('Professional')
      .doc(route.params.professionalId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setProfessionalData(documentSnapshot.data());
        }
      });
  };

  // const getProfessionalRaiting = async () => {
  //   await firestore()
  //     .collection('Professional')
  //     .doc(route.params.professionalId)
  //     .collection('Rating')
  //     .doc(auth().currentUser.uid)
  //     .get()
  //     .then(documentSnapshot => {
  //       if (documentSnapshot.exists) {
  //         setProfessionalRating(documentSnapshot.data());
  //         console.log(professionalRating);
  //       }
  //     });
  // };

  const checkVerified = async () => {
    setUploading(true);

    await firestore()
      .collection('Professional')
      .doc(route.params.professionalId)
      .get()
      .then(result => {
        if (result.exists) {
          setVerified(result.data().Verified);
          setUploading(false);
        } else {
          setVerified('notVerified');
          setUploading(false);
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
    getProfessional();
    checkVerified();
    // getProfessionalRaiting();
  }, []);

  let Name = (
    <Text>
      Dr.
      {professionalData
        ? professionalData.fname || 'Professional'
        : 'Professional'}{' '}
      {professionalData ? professionalData.lname || 'Profile' : 'Profile'}
    </Text>
  );

  const ratingCompleted = rating => {
    console.log('Rating is: ' + rating);
    setRatingData(rating);
    console.log('Rating is: ' + ratingData);
  };

  const CustomRatingBar = () => {
    return (
      <View style={styles.CustomRatingBarStyle}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setDefaultRating(item)}>
              <Image
                style={styles.starImgStyle}
                source={
                  item <= defaultRating
                    ? {uri: starImgFilled}
                    : {uri: starImgCorner}
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const onSubmitReview = () => {
    setSubmitting(true);

    firebase
      .firestore()
      .collection('Professional')
      .doc(route.params.professionalId)
      .collection('Rating')
      .doc(auth().currentUser.uid)
      .set({
        ReviewTime: firestore.Timestamp.fromDate(new Date()),
        ReviewerId: auth().currentUser.uid,
        Review: defaultRating,
        ReviewContent: review || 'No review',
      })
      .then(() => {
        setSubmitting(false);
        navigation.navigate('AfterReview');
      });
    setReview('');
    // .then(() =>{
    // setSubmitting(false);
    // navigation.navigate('AfterReview'), setReview(''))}
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView>
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
                    paddingTop: 20,
                    justifyContent: 'center',
                  }}>
                  <Avatar
                    rounded
                    size={100}
                    source={{
                      uri: professionalData
                        ? professionalData.userImg ||
                          'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg'
                        : 'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
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
                      Dr.
                      {professionalData
                        ? professionalData.fname || 'Professional'
                        : 'Professional'}{' '}
                      {professionalData
                        ? professionalData.lname || 'Profile'
                        : 'Profile'}
                    </Text>
                    {isVerified == 'notVerified' ? null : isVerified ==
                      'Verified' ? (
                      <View style={{}}>
                        {uploading ? (
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginLeft: 8,
                              paddingTop: 13,
                            }}>
                            <BallIndicator color={COLORS.secondary} size={10} />
                          </View>
                        ) : (
                          <View style={{paddingTop: 13}}>
                            <Image
                              source={icons.verifiedUser}
                              style={{
                                width: 15,
                                height: 15,
                                marginLeft: 3,
                                tintColor: COLORS.primary,
                              }}
                            />
                          </View>
                        )}
                      </View>
                    ) : null}
                  </View>
                </View>

                <View style={{flex: 1, marginTop: 10}}>
                  <Text
                    style={{
                      ...FONTS.h5,
                      color: COLORS.secondary,
                      textAlign: 'center',
                      marginTop: 10,
                      width: '95%',
                    }}>
                    How Was Your Experience With {Name}
                  </Text>

                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginVertical: 20,
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          ...FONTS.h1,
                          color: COLORS.secondary,
                          marginBottom: SIZES.padding,
                        }}>
                        {defaultRating}
                      </Text>

                      <Text
                        style={{
                          ...FONTS.h5,
                          color: COLORS.darkgray,
                          marginBottom: SIZES.padding - 5,
                        }}>
                        {'/' + maxRating.length}
                      </Text>
                    </View>
                    <CustomRatingBar />
                  </View>

                  <View style={styles.newPostContainer}>
                    <View style={styles.textInputContainer}>
                      <TextInput
                        placeholder="Write your review here.."
                        multiline
                        value={review}
                        onChangeText={txt => setReview(txt)}
                        style={styles.postInput}
                      />
                    </View>
                  </View>
                </View>
                <View style={{paddingVertical: 30}}>
                  {submitting ? (
                    <Button
                      onPress={onSubmitReview}
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
                  ) : (
                    <Button
                      onPress={onSubmitReview}
                      title="Submit review"
                      titleStyle={{...FONTS.h6, color: COLORS.primary}}
                      // loading
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
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RatingTheProfessional;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  newPostContainer: {
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 7,
    borderColor: COLORS.lightpurple,
    alignContent: 'center',
  },
  textInputContainer: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  postInput: {
    textAlign: 'left',
    color: COLORS.secondary,
    ...FONTS.body4,
  },
  CustomRatingBarStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  starImgStyle: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
  },
});
