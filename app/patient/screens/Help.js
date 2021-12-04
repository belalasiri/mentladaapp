import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const Help = () => {
  return (
    <View style={styles.container}>
      <Text>Help Screen </Text>
    </View>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
