import React from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';

const Settings = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>Settings Screen </Text>
      <Button title="Next screen" onPress={() => navigation.navigate('Chat')} />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
