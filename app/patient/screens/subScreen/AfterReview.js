import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {COLORS, FONTS, icons, SIZES} from '../../../constants';

const AfterReview = ({navigation}) => {
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
          onPress={() => navigation.navigate('Home')}>
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
