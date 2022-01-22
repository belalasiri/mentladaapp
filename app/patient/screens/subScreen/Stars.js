import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS} from '../../../constants';
import firestore, {firebase} from '@react-native-firebase/firestore';

const Stars = ({item}) => {
  const [professionalRating, setProfessionalRating] = useState([]);
  const [isStarReloading, setStarReloading] = useState(false);

  const [defaultRating, setDefaultRating] = useState(starRatings);
  const [maxRating] = useState([1, 2, 3, 4, 5]);

  const starImgFilled =
    'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
  const starImgCorner =
    'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';

  useLayoutEffect(() => {
    setStarReloading(true);
    const getProfessionalRaiting = firestore()
      .collection('Professional')
      .doc(item.professionalId)
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
        setStarReloading(false),
        console.log(professionalRating),
      );

    return getProfessionalRaiting;
  }, []);

  let starRatings = 0;
  professionalRating.forEach(item => {
    starRatings += item.Review / professionalRating.length;
  });
  useEffect(() => {
    setDefaultRating(starRatings);
  }, [professionalRating]);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
      }}>
      {starRatings ? (
        <View style={{flexDirection: 'row'}}>
          {maxRating.map((item, key) => {
            return (
              <View key={item}>
                <Image
                  style={styles.starImgStyle}
                  source={
                    item <= defaultRating
                      ? {uri: starImgFilled}
                      : {uri: starImgCorner}
                  }
                />
              </View>
            );
          })}
        </View>
      ) : (
        <Text
          style={{
            ...FONTS.body6,
            textAlign: 'center',
            color: COLORS.secondary,
          }}>
          No Ratings Yet
        </Text>
      )}

      <Text style={{...FONTS.h7, color: COLORS.primary}}>
        {professionalRating.length}
        {'  '}reviews
      </Text>
    </View>
  );
};
export default Stars;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starImgStyle: {
    width: 15,
    height: 15,
    resizeMode: 'cover',
    tintColor: COLORS.primary,
    marginRight: 3,
  },
});
