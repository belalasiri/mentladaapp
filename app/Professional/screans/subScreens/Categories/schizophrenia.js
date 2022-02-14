import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const schizophrenia = () => {
  return (
    <View style={styles.container}>
      <Text>schizophrenia Screen </Text>
    </View>
  );
};

export default schizophrenia;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
