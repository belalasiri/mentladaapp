import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const ProfProfile = () => {
  return (
    <View style={styles.container}>
      <Text>ProfProfile Screen </Text>
    </View>
  );
};

export default ProfProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   },
});