import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const CustomList = () => {
  return (
    <View style={styles.container}>
      <Text>CustomList Screen </Text>
    </View>
  );
};

export default CustomList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   },
});