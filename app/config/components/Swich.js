import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
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
        height: 44,
        width: '100%',
        // backgroundColor: colors.w,
        borderRadius: 7,
        borderColor: colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(1)}
        style={{
          flex: 1,
          backgroundColor: getSelectionMode == 1 ? colors.secoundary : colors.w,
          borderRadius: 7,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: getSelectionMode == 1 ? colors.text : colors.primary,
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
           activeOpacity: 0.6,
          flex: 1,
          backgroundColor: getSelectionMode == 2 ? colors.secoundary : colors.w,
          borderRadius: 7,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: getSelectionMode == 2 ? colors.text : colors.primary,
            fontSize: 14,
            fontFamily: font.title,
          }}>
          {option2}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
