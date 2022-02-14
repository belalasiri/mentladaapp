import React, {useState} from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';

import CustomSwitch from './app/config/components/CustomSwitch';
import FormButton from './app/config/components/FormButton';
import CustomLink from './app/config/components/CustomLink';

const AppRoutes = navigation => {
  const [SwitchTab, setSwitchTab] = useState(1);

  const onSelectSwitch = value => {
    setSwitchTab(value);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView style={{padding: 20}}>
        <View style={{marginVertical: 20, justifyContent: 'flex-end'}}>
          <CustomSwitch
            selectionMode={1}
            option1="Patient"
            option2="Professional"
            onSelectSwitch={onSelectSwitch}
          />
        </View>
        <View style={{justifyContent: 'flex-end'}}>
          {SwitchTab == 1 && (
            <View>
              <FormButton buttonTitle="Login as patient" />
              <CustomLink
                text="Don’t have an account?  "
                textWithLink="Create here"
                onPress={() => navigation.navigate('Signup')}
              />
            </View>
          )}
          {SwitchTab == 2 && (
            <View>
              <FormButton buttonTitle="Login as Professional" />
              <CustomLink
                text="Don’t have an account?  "
                textWithLink="Create here"
                onPress={() => navigation.navigate('Signup')}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppRoutes;
