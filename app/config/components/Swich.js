import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {COLORS} from '../../constants';
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
        borderRadius: 7,
        borderColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(1)}
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          justifyContent: 'center',
          borderBottomColor:
            getSelectionMode == 1 ? colors.subtext : COLORS.white,
          borderBottomWidth: 2,
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: getSelectionMode == 1 ? COLORS.secondary : COLORS.secondary,
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
          backgroundColor: COLORS.white,
          borderBottomColor:
            getSelectionMode == 2 ? COLORS.secondary : COLORS.white,
          borderBottomWidth: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: getSelectionMode == 2 ? COLORS.secondary : COLORS.secondary,
            fontSize: 14,
            fontFamily: font.title,
          }}>
          {option2}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
