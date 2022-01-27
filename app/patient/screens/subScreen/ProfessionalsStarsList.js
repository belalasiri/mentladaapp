import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {COLORS, FONTS} from '../../../constants';
import firestore, {firebase} from '@react-native-firebase/firestore';

const ProfessionalsStarsList = ({item}) => {
  const [professionalRating, setProfessionalRating] = useState([]);
  const [isStarReloading, setStarReloading] = useState(false);

  const starImgFilled =
    'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';

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
        // console.log(professionalRating),
      );

    return getProfessionalRaiting;
  }, []);

  let starRatings = 0;
  professionalRating.forEach(item => {
    starRatings += item.Review / professionalRating.length;
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {starRatings ? (
        <>
          <Image style={styles.starImgStyle} source={{uri: starImgFilled}} />
          {starRatings == '5' ? (
            <Text
              style={{
                color: COLORS.primary,
                marginBottom: 2,
                paddingLeft: 5,
                ...FONTS.h6,
              }}>
              {starRatings}
            </Text>
          ) : (
            <Text
              style={{
                color: COLORS.primary,
                marginBottom: 2,
                paddingLeft: 5,
                ...FONTS.h6,
              }}>
              {starRatings.toFixed(1)}
            </Text>
          )}
        </>
      ) : (
        <Text
          style={{
            color: COLORS.primary,
            marginBottom: 2,
            ...FONTS.h7,
          }}>
          No Ratings Yet
        </Text>
      )}
    </View>
  );
};

export default ProfessionalsStarsList;

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
