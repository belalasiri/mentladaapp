import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const ProfBlog = () => {
  return (
    <View style={styles.container}>
      <Text>ProfBlog Screen </Text>
    </View>
  );
};

export default ProfBlog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
