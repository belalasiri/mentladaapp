import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
// DataBase
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Avatar} from 'react-native-elements';
import {COLORS, FONTS, SIZES} from '../../../constants';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import ReadMore from 'react-native-read-more-text';
import {BallIndicator, BarIndicator} from 'react-native-indicators';
import moment from 'moment';

const ReviewerData = ({item, dataLength}) => {
  const [usersRaiting, setUsersRaiting] = useState(null);
  const [isReloading, setReloading] = useState(false);
  const [defaultRating, setDefaultRating] = useState(item.Review);
  const [maxRating] = useState([1, 2, 3, 4, 5]);
  const starImgFilled =
    'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
  const starImgCorner =
    'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';

  const ussesRaitingData = async () => {
    setReloading(true);
    await firestore()
      .collection('users')
      .doc(item.ReviewerId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUsersRaiting(documentSnapshot.data());
          setReloading(false);
        }
      });
  };

  //   const rev = () => {

  //   };

  let cul = item.Review * dataLength;

  useEffect(() => {
    ussesRaitingData();
    setDefaultRating(item.Review);
  }, []);

  return (
    <LinearGradient
      colors={['#f7f3fc', COLORS.white]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={{
        margin: 10,
        alignItems: 'flex-start',
        borderRadius: 7,
        padding: SIZES.padding * 2 - 5,
        justifyContent: 'center',
      }}>
      <View style={styles.container}>
        {isReloading ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
            }}>
            <BallIndicator color={COLORS.secondary} size={20} />
          </View>
        ) : (
          <Avatar
            size={50}
            rounded
            source={{
              uri: usersRaiting
                ? usersRaiting.userImg ||
                  'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
            }}
          />
        )}
        <View style={styles.infoContiner}>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: 1,
              flexDirection: 'row',
            }}>
            <Text style={styles.Name}>
              {usersRaiting ? usersRaiting.fname || 'Mentlada' : 'Mentlada'}{' '}
              {usersRaiting ? usersRaiting.lname || 'Patient' : 'Patient'}
            </Text>
            <Text
              style={{
                ...FONTS.body6,
                color: COLORS.primary,
                marginTop: 5,
              }}>
              {moment(item.ReviewTime.toDate()).format('LLL')}{' '}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 0}}>
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
        </View>
      </View>
      <View style={{marginTop: 10}}>
        {item.ReviewContent == 'No review' ? null : (
          <ReadMore
            numberOfLines={3}
            renderTruncatedFooter={_renderTruncatedFooter}
            renderRevealedFooter={_renderRevealedFooter}>
            <Text style={styles.ReviewContentStyles}>{item.ReviewContent}</Text>
          </ReadMore>
        )}
      </View>
    </LinearGradient>
  );
};
const _renderTruncatedFooter = handlePress => {
  return (
    <Text
      style={{color: COLORS.primary, marginTop: 5, ...FONTS.h6}}
      onPress={handlePress}>
      Read more
    </Text>
  );
};

const _renderRevealedFooter = handlePress => {
  return (
    <Text
      style={{color: COLORS.primary, marginTop: 5, ...FONTS.h6}}
      onPress={handlePress}>
      Show less
    </Text>
  );
};
export default ReviewerData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  Name: {
    ...FONTS.h5_2,
    color: COLORS.secondary,
  },
  infoContiner: {
    flex: 1,
    marginLeft: SIZES.padding,
  },
  ReviewContentStyles: {
    ...FONTS.body4,
    color: COLORS.secondary,
  },
  starImgStyle: {
    width: 14,
    height: 14,
    resizeMode: 'cover',
    tintColor: COLORS.primary,
    marginRight: 3,
  },
});
