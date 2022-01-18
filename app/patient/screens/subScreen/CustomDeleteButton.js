import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS} from '../../../constants';
import Feather from 'react-native-vector-icons/Feather';

const CustomDeleteButton = ({onDelete, IconName}) => {
  return (
    <TouchableOpacity onPress={onDelete}>
      <Feather name="delete" size={25} color={COLORS.primary} />
    </TouchableOpacity>
  );
};

export default CustomDeleteButton;
