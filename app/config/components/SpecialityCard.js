import React from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import colors from '../../config/colors';
import font from '../../config/font';

const SpecialityCard = ({text}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', padding: 5}}>
      <Text
        style={{
          fontSize: 14,
          fontFamily: font.title,
          color: colors.text,
          backgroundColor: colors.empty,
          paddingVertical: 5,
          paddingHorizontal: 10,

          borderRadius: 7,
        }}>
        {text}
      </Text>
    </View>
  );
};

export default SpecialityCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
