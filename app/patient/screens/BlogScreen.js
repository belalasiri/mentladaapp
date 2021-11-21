import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const BlogScreen = () => {
  return (
    <View style={styles.container}>
      <Text>BlogScreen Screen </Text>
    </View>
  );
};

export default BlogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   },
});