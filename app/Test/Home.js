import * as React from 'react';
import {Text, StatusBar, Button, StyleSheet} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

const Home = ({navigation}) => {
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: '#fff'}]}>
      <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
      <Text>Light Screen</Text>
      <Button title="Next screen" onPress={() => navigation.navigate('Feed')} />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
