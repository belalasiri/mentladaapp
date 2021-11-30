import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Animated from 'react-native-reanimated';

const Card = ({navigation, Profdata, index, route}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('chat')}>
      <Animated.View style={{...styles.card}}>
        <Text>{Profdata.fname}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
