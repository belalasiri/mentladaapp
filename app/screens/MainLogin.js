import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import CustomSwitch from '../config/components/CustomSwitch';

export default function HomeScreen({navigation}) {
  const [gamesTab, setGamesTab] = useState(1);

  const onSelectSwitch = value => {
    setGamesTab(value);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView style={{padding: 20}}>
        <View style={{marginVertical: 20}}>
          <CustomSwitch
            selectionMode={1}
            option1="Patient"
            option2="Professional"
            onSelectSwitch={onSelectSwitch}
          />
        </View>

        {gamesTab == 1 && <Text>Patient</Text>}
        {gamesTab == 2 && <Text>Patient</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}
