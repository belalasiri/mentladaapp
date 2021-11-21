import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const ProfHome = () => {
  return (
    <View style={styles.container}>
      <Text>ProfHome Screen </Text>
    </View>
  );
};

export default ProfHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
