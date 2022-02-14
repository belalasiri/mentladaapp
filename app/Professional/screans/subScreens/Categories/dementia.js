import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const dementia = () => {
  return (
    <View style={styles.container}>
      <Text>dementia Screen </Text>
    </View>
  );
};

export default dementia;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   },
});