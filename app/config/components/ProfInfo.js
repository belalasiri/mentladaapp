import React from 'react';
import {Text, View, StyleSheet, Image, SafeAreaView} from 'react-native';
import font from '../../config/font';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfInfo = ({
  Title1,
  Title2,
  icon,
  iconColor,
  backgroundColor,
  ...rest
}) => {
  let bg = backgroundColor;

  return (
    <View style={{flex: 1, margin:5}}>
      <View style={[styles.container, {backgroundColor: bg}]} {...rest}>
        <Icon name={icon} size={20} color={iconColor} />
        <Text style={{fontSize: 16, fontFamily: font.title}}>{Title1}</Text>
        <Text style={{fontSize: 12, fontFamily: font.subtitle}}>{Title2}</Text>
      </View>
    </View>
  );
};

export default ProfInfo;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 7,
    // padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
});
