import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import colors from '../colors';
import font from '../font';

export default function CustomSwitch({
  selectionMode,
  option1,
  option2,
  onSelectSwitch,
}) {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);

  const updateSwitchData = value => {
    setSelectionMode(value);
    onSelectSwitch(value);
  };

  return (
    <View
      style={{
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 7,
        borderColor: '#B283E4',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(1)}
        style={{
          flex: 1,
          borderColor: getSelectionMode == 1 ? '#B283E4' : colors.empty,
          borderRadius: 7,
          borderWidth: 3,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/image/patient.png')}
          style={{height: 100, width: 100, resizeMode: 'cover'}}
        />
        <Text
          style={{
            opacity: 5,
            color: getSelectionMode == 1 ? colors.primary : colors.text,
            fontSize: 14,
            fontFamily: font.title,
          }}>
          {option1}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(2)}
        style={{
          flex: 1,
          borderColor: getSelectionMode == 2 ? '#B283E4' : colors.empty,
          borderRadius: 7,
          borderWidth: 3,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/image/professional.png')}
          style={{height: 100, width: 100, resizeMode: 'cover'}}
        />
        <Text
          style={{
            color: getSelectionMode == 2 ? colors.primary : colors.text,
            fontSize: 14,
            fontFamily: font.title,
          }}>
          {option2}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
