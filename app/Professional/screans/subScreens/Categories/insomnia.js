import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const insomnia = () => {
  return (
    <View style={styles.container}>
      <Text>insomnia Screen </Text>
    </View>
  );
};

export default insomnia;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   },
});