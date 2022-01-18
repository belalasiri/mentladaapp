import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const TestLikesList = ({item}) => {
  return (
    <View style={styles.container}>
      <Text>{item.id}</Text>
    </View>
  );
};

export default TestLikesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
