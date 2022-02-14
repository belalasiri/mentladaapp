import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const likes = ({item}) => {
  return (
    <View style={styles.container}>
      <Text>likes Screen ss{item.Liked} </Text>
    </View>
  );
};

export default likes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
