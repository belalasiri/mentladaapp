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

import {COLORS, FONTS, icons, SIZES} from '../../../constants';

const AfterReview = ({navigation, route}) => {
  const [professionalData, setProfessionalData] = useState([]);
  const [professionalRating, setProfessionalRating] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVerified, setVerified] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [defaultRating, setDefaultRating] = useState(5);
  const [maxRating] = useState([1, 2, 3, 4, 5]);
  const [submitting, setSubmitting] = useState(false);
  const [review, setReview] = useState(null);

  useLayoutEffect(() => {
    const getProfessionalRaiting = firestore()
      .collection('Professional')
      .doc(route.params.professionalId)
      .collection('Rating')
      .orderBy('ReviewTime', 'desc')
      .onSnapshot(
        snapshot =>
          setProfessionalRating(
            snapshot.docs.map(doc => ({
              id: doc.id,
              ReviewerId: doc.data().ReviewerId,
              ReviewContent: doc.data().ReviewContent,
              ReviewTime: doc.data().ReviewTime,
              Review: doc.data().Review,
            })),
          ),
        // console.log(professionalRating),
      );

    return getProfessionalRaiting;
  }, []);
  const onHome = () => {
    firebase
      .firestore()
      .collection('Professional')
      .doc(route.params.professionalId)
      .update({
        starRatings: starRatings,
      })
      .then(() => {
        navigation.navigate('Home');
      });
  };

  let starRatings = 0;
  professionalRating.forEach(item => {
    starRatings += item.Review / professionalRating.length;
  });
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 60,
        }}>
        <Image source={icons.Review} />
        <View style={{marginTop: 20}}>
          <Text
            style={{
              textAlign: 'center',
              ...FONTS.h4_2,
              color: COLORS.secondary,
            }}>
            Super thank you 😍✨
          </Text>
        </View>
        <View style={{width: '90%', marginTop: 5}}>
          <Text
            style={{
              textAlign: 'center',
              ...FONTS.body4,
              color: COLORS.secondary,
            }}>
            Thank you for your feedback we will keep our service better
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginVertical: 20,
          marginBottom: 20,
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            backgroundColor: COLORS.lightpurple,
            alignItems: 'center',
            borderRadius: 7,
            margin: 5,
            padding: 10,
            width: SIZES.width - 30,
          }}
          onPress={onHome}>
          <Text
            style={{
              textAlign: 'center',
              ...FONTS.h6,
              color: COLORS.primary,
            }}>
            Go to home
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AfterReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});
