import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const Feed = () => {
  return (
    <View style={styles.container}>
      <Text>Feed Screen </Text>
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
