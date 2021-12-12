import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
// import Animated from 'react-native-reanimated';

const Card = ({navigation, Profdata, index, route}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('chat')}>
      <View style={{...styles.card}}>
        <Text>{Profdata.fname}</Text>
      </View>
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
