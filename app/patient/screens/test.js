import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const test = () => {
  return (
    <View style={styles.container}>
      <Text>test Screen </Text>
    </View>
  );
};

export default test;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
