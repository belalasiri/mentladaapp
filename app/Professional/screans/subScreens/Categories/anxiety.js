import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const anxiety = () => {
  return (
    <View style={styles.container}>
      <Text>anxiety Screen </Text>
    </View>
  );
};

export default anxiety;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   },
});