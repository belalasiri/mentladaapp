import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, FONTS, icons, images, SIZES} from '../../../constants';

//DataBase
import storage from '@react-native-firebase/storage';
import firestore, {firebase} from '@react-native-firebase/firestore';

const PlansCustom = ({
  item,
  navigation,
  handleNavigation,
  onPlanDetailsPress,
}) => {
  const [plans, setPlans] = useState([]);
  const [isUpdating, setUpdating] = useState(false);
  const [dialog, setDialog] = useState(false);

  const Content = ({HederText, Body, Body2, Price, priceInfo, onPress}) => {
    return (
      <>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingLeft: 15,
            }}>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.secondary,
                fontSize: 15,
              }}>
              {HederText}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'DINNextLTArabic-Regular',
                lineHeight: 25,
                color: COLORS.secondary,
                textAlign: 'left',
                width: SIZES.width / 2,
              }}>
              {Body}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                ...FONTS.body4,
                color: COLORS.secondary,
                fontSize: 13,
              }}>
              {Body2}
            </Text>
            <Text
              style={{
                ...FONTS.h4,
                color: COLORS.secondary,
                textAlign: 'center',
                fontSize: 20,
              }}>
              RM{Price}
            </Text>
            <Text
              style={{
                ...FONTS.body4,
                textAlign: 'center',
                fontSize: 11,
              }}>
              {priceInfo}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'space-around',
            }}>
            <LinearGradient
              colors={[COLORS.lightpurple, COLORS.lightpurple]}
              start={{x: 0.4, y: 2}}
              end={{x: 0.4, y: 0}}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 7,
                marginHorizontal: 5,
              }}>
              <TouchableOpacity
                style={{
                  borderRadius: 7,
                  padding: 10,
                }}
                onPress={onPress}>
                <Text
                  style={{
                    color: COLORS.primary,
                    ...FONTS.h7,
                  }}>
                  Subscribe now
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </>
    );
  };

  useLayoutEffect(() => {
    const FETCH_PLANS = firestore()
      .collection('Plans')
      .onSnapshot(snapshot =>
        setPlans(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
            planPrice: doc.data().planPrice,
            planType: doc.data().planType,
            planFeatures: doc.data().planFeatures,
          })),
        ),
      );
    return FETCH_PLANS;
  }, []);

  return (
    <View>
      <LinearGradient
        colors={['#f7f3fc', '#fff', '#f7f3fc']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{
          flexDirection: 'row',
          marginHorizontal: 15,
          marginVertical: 5,
          alignItems: 'center',
          borderRadius: 7,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            marginHorizontal: 5,
          }}>
          {item.planType == 'Premium' ? (
            <View
              style={{
                backgroundColor: COLORS.primary,
                width: SIZES.width / 2 - 20,
                borderBottomRightRadius: 30,
                borderTopRightRadius: 30,
                marginTop: 10,
              }}>
              <Text
                style={{
                  color: COLORS.lightpurple,
                  paddingLeft: 20,
                  ...FONTS.h4_2,
                }}>
                Best value
              </Text>
            </View>
          ) : null}
          <View style={{padding: 10}}>
            <Content
              HederText={item.planType}
              Body={item.planFeatures}
              Price={item.planPrice}
              priceInfo="* VAT & local taxes is applied"
              onPress={onPlanDetailsPress}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default PlansCustom;
