import React from 'react';
import {StatusBar} from 'react-native';
import Providers from './app/navigation';

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
