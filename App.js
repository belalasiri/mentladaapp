import React from 'react';
import {StatusBar, LogBox} from 'react-native';
import Providers from './app/navigation';

// Ignore log notification by message:

// Ignore all log notifications:
// LogBox.ignoreAllLogs();
const App = () => {
  LogBox.ignoreLogs(['Warning: sssssssssssssssssss']);
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
