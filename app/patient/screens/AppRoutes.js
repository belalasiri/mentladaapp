import React, {useState} from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';

import CustomSwitch from '../../config/components/CustomSwitch';
import FormButton from '../../config/components/FormButton';
import CustomLink from '../../config/components/CustomLink';

const AppRoutes = ({navigation}) => {
  const [SwitchTab, setSwitchTab] = useState(1);

  const onSelectSwitch = value => {
    setSwitchTab(value);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
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
          <View>
            <FormButton
              buttonTitle="Login"
              onPress={() => navigation.navigate('Login')}
            />
            <CustomLink
              text="Don’t have an account?  "
              textWithLink="Create here"
              onPress={() => navigation.navigate('patientSignup')}
            />
          </View>
        )}

        {SwitchTab == 2 && (
          <View>
            <FormButton
              buttonTitle="Login"
              onPress={() => navigation.navigate('Login')}
            />
            <CustomLink
              text="Don’t have an account?  "
              textWithLink="Create here"
              onPress={() => navigation.navigate('professionalSignup')}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppRoutes;
