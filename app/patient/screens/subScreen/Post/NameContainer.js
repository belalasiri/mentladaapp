import React from 'react';
import {Text, View, StyleSheet, Image, Pressable} from 'react-native';
import {Avatar} from 'react-native-elements';
import {COLORS, FONTS, icons, SIZES} from '../../../../constants';
import {BarIndicator} from 'react-native-indicators';

const NameContainer = ({userName, userImg, postTime, onBack, loading}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SIZES.padding * 2,
      }}>
      <Pressable onPress={onBack}>
        <Image
          source={icons.back}
          style={{
            width: 30,
            height: 30,
            marginRight: SIZES.padding2,
            tintColor: COLORS.secondary,
          }}
        />
      </Pressable>
      {loading ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: SIZES.padding * 1.4,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <BarIndicator color={COLORS.secondary} size={15} />
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.secondary,
                marginHorizontal: SIZES.padding * 2,
              }}>
              Loading..
            </Text>
          </View>
        </View>
      ) : (
        <>
          <Avatar rounded size={50} source={userImg} />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginHorizontal: SIZES.padding * 1.4,
            }}>
            <Text style={{...FONTS.h5, color: COLORS.secondary}}>
              {userName}
            </Text>
            <Text style={{...FONTS.body6, color: COLORS.secondary}}>
              {postTime}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default NameContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
