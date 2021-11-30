import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Animated,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../colors';
import font from '../../font';
const {width} = Dimensions.get('screen');
const cardWidth = width / 1.6;

const profCard = ({navigation, route, onPress}) => {
  const [Profdata, setProfdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  
  let profList = [];

  const fetchProf = async () => {
    await firestore()
      .collection('Professional')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          profList.push({
            id: doc.id,
            fname: doc.data().fname,
            lname: doc.data().lname,
            email: doc.data().email,
            about: doc.data().about,
            Experience: doc.data().Experience,
            License: doc.data().License,
            Specialty: doc.data().Specialty,
            userImg: doc.data().userImg,
            role: doc.data().role,
          });
        });
      })
      .catch(e => {
        console.log(e);
      });
    setProfdata(profList);

    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProf();
    // navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading]);

  const [activeCardIndex, setActiveCardIndex] = React.useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const Card = ({Profdata, index}) => {
    const inputRange = [
      (index - 1) * cardWidth,
      index * cardWidth,
      (index + 1) * cardWidth,
    ];
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 0, 0.7],
    });
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
    });
    return (
      <TouchableOpacity
        disabled={activeCardIndex != index}
        activeOpacity={1}
        // onPress={() => navigation.navigate('ProfProfile')}
        onPress={onPress}>
        <Animated.View style={{...style.card, transform: [{scale}]}}>
          <Animated.View style={{...style.cardOverLay, opacity}} />
          <View style={style.priceTag}>
            <Text
              style={{
                color: COLORS.w,
                fontSize: 16,
                fontFamily: font.subtitle,
              }}>
              {Profdata.Experience}
            </Text>
          </View>
          <Image
            source={{
              uri: Profdata
                ? Profdata.userImg ||
                  'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg'
                : 'https://i.ibb.co/Rhmf85Y/6104386b867b790a5e4917b5.jpg',
            }}
            style={style.cardImage}
          />

          <View style={style.cardDetails}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text
                  style={{
                    fontFamily: font.title,
                    fontSize: 16,
                    color: COLORS.text,
                  }}>
                  {Profdata ? Profdata.fname || 'Mentlada' : 'Mentlada'}{' '}
                  {Profdata ? Profdata.lname || 'Mentlada' : 'Mentlada'}
                </Text>
                <Text
                  style={{
                    color: COLORS.subtext,
                    fontSize: 12,
                    fontFamily: font.title,
                  }}>
                  {Profdata ? Profdata.Specialty || 'Mentlada' : 'Spacialist'}
                </Text>
              </View>
              <Icon
                name="chevron-forward-outline"
                size={26}
                color={COLORS.primary}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="star" size={15} color={COLORS.secoundary} />
                <Icon name="star" size={15} color={COLORS.secoundary} />
                <Icon name="star" size={15} color={COLORS.secoundary} />
                <Icon name="star" size={15} color={COLORS.secoundary} />
                <Icon name="star" size={15} color={COLORS.secoundary} />
              </View>
              <Text style={{fontSize: 10, color: COLORS.subtext}}>
                365 reviews
              </Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            fontSize: 11,
            color: 'black',
            fontWeight: '500',
            textShadowColor: 'rgba(0, 0, 0, 0.15)',
            textShadowOffset: {width: -1, height: 1},
            textShadowRadius: 10,
          }}>
          ssss
        </Text>
        <View>
          <Animated.FlatList
            onMomentumScrollEnd={e => {
              setActiveCardIndex(
                Math.round(e.nativeEvent.contentOffset.x / cardWidth),
              );
            }}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: true},
            )}
            horizontal
            data={Profdata}
            contentContainerStyle={{
              paddingVertical: 30,
              paddingLeft: 20,
              paddingRight: cardWidth / 2 - 40,
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <Card Profdata={item} index={index} />
            )}
            snapToInterval={cardWidth}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  card: {
    height: 280,
    width: cardWidth,
    elevation: 7,
    // marginRight: 20,
    borderRadius: 7,
    backgroundColor: '#fff',
  },
  cardImage: {
    height: 200,
    width: '100%',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  priceTag: {
    height: 60,
    width: 80,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    zIndex: 1,
    right: 0,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDetails: {
    height: 100,
    borderRadius: 15,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  cardOverLay: {
    height: 280,
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 100,
    width: cardWidth,
    borderRadius: 7,
  },
  topHotelCard: {
    height: 120,
    width: 120,
    backgroundColor: '#fff',
    elevation: 15,
    marginHorizontal: 10,
    borderRadius: 7,
  },
  topHotelCardImage: {
    height: 80,
    width: '100%',
    borderTopRightRadius: 7,
    borderTopLeftRadius: 7,
  },
});

export default profCard;
