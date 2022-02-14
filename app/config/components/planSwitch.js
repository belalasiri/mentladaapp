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
    <View style={{flex: 2, backgroundColor: '#000', width: '100%'}}>
      <View style={{flex: 1, backgroundColor: '#000', width: '100%'}}>
        <TouchableOpacity></TouchableOpacity>
      </View>
    </View>
  );
}
