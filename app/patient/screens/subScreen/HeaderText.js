import React from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import font from '../../../config/font';
import {COLORS, FONTS} from '../../../constants';

const HeaderText = ({item, onEditPress}) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginHorizontal: 20,
      }}>
      <View>
        <Text
          style={{
            color: COLORS.secondary,
            ...FONTS.h5,
            lineHeight: 25,
          }}>
          {item.HeaderText}
        </Text>
      </View>
    </View>
  );
};

export default HeaderText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
