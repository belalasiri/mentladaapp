import React, {useState} from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';

import CustomSwitch from '../../config/components/CustomSwitch';
import LoginScreen from '../../screens/patientLogin';
import CustomLink from '../../config/components/CustomLink';
import Prof_Login from '../../screens/professionalLogin';

export default function Pati_Login({navigation}) {
  const [SwitchTab, setSwitchTab] = useState(1);

  const onSelectSwitch = value => {
    setSwitchTab(value);
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

        {SwitchTab == 1 && (
          <>
            <LoginScreen />
            <CustomLink
              text="Don’t have an account?  "
              textWithLink="Create here"
              onPress={() => navigation.navigate('patientSignup')}
            />
          </>
        )}
        {SwitchTab == 2 && (
          <>
            <Prof_Login />
            <CustomLink
              text="Don’t have an account?  "
              textWithLink="Create here"
              onPress={() => navigation.navigate('professionalSignup')}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
