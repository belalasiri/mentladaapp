import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const stress = () => {
  return (
    <View style={styles.container}>
      <Text>stress Screen </Text>
    </View>
  );
};

export default stress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
