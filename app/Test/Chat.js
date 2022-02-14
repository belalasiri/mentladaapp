import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const Chat = () => {
  return (
    <View style={styles.container}>
      <Text>Chat Screen </Text>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
