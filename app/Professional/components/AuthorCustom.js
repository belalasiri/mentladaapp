import React from 'react';
import {Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS, icons} from '../../constants';

const AuthorCustom = ({onDelete}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        position: 'absolute',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        onPress={onDelete}
        style={{
          backgroundColor: 'rgba(36, 26, 46, 0.4)',
          width: 80,
          height: 80,
          borderRadius: 70,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={icons.Delete}
          style={{
            width: 30,
            height: 30,
            tintColor: COLORS.white,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default AuthorCustom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
