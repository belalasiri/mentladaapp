import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS} from '../../../../constants';

const onDelete = ({onDelete, IconName}) => {
  return (
    <TouchableOpacity onPress={onDelete}>
      <Feather name={IconName} size={25} color={COLORS.primary} />
    </TouchableOpacity>
  );
};

export default onDelete;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
