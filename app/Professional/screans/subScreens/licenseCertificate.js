import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const licenseCertificate = () => {
  return (
    <View style={styles.container}>
      <Text>licenseCertificate Screen </Text>
    </View>
  );
};

export default licenseCertificate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
