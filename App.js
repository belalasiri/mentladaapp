import React from 'react';
import {StatusBar, LogBox} from 'react-native';
import Providers from './app/navigation';

LogBox.ignoreAllLogs();
const App = () => {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <Providers />
    </>
  );
};

export default App;
