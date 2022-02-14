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

// DataBase
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

//Libraries
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {Avatar, Button, ListItem} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {BallIndicator, BarIndicator} from 'react-native-indicators';
import {AirbnbRating} from 'react-native-elements';

// imports
import {COLORS, FONTS, icons, SIZES} from '../../constants';
import ReviewerData from './subScreen/ReviewerData';
import moment from 'moment';

const ReviewsList = ({navigation, route}) => {
  const [professionalRating, setProfessionalRating] = useState([]);
  const [isReloading, setReloading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Reviews',
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

  useLayoutEffect(() => {
    setReloading(true);
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
        setReloading(false),
      );

    return getProfessionalRaiting;
  }, [navigation]);

  let starRatings = 0;
  professionalRating.forEach(item => {
    starRatings += item.Review / professionalRating.length;
  });

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={{flex: 1}}>
        {professionalRating?.[0] ? (
          <View
            style={{
              flex: 1,
            }}>
            {isReloading ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <BarIndicator color={COLORS.secondary} size={30} />
              </View>
            ) : (
              <FlatList
                data={professionalRating}
                // showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({id, item}) => (
                  <ReviewerData
                    key={id}
                    item={item}
                    dataLength={professionalRating.length}
                  />
                )}
              />
            )}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../assets/image/image.png')}
              style={{
                height: SIZES.height / 3 + 20,
                width: SIZES.width / 2 + 20,
              }}
            />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.secondary,
                }}>
                No ratings yet
              </Text>
              <Text
                style={{
                  ...FONTS.body4,
                  color: COLORS.secondary,
                  textAlign: 'center',
                  width: SIZES.width - 40,
                  marginTop: 5,
                }}>
                Dr.{route.params.profName}'s rating will appear here if any
                Mentlada patient leaves a review...
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default ReviewsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
