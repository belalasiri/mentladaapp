import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

import Switch from '../../config/components/planSwitch';
import FormButton from '../../config/components/FormButton';
import CustomLink from '../../config/components/CustomLink';

const sessionPlan = ({navigation}) => {
  const [SwitchTab, setSwitchTab] = useState(1);

  const onSelectSwitch = value => {
    setSwitchTab(value);
  };

  return (
    <View
      style={{
        height: 280,
        resizeMode: 'cover',
        elevation: 3,
        marginRight: 15,
        borderRadius: 7,
      }}>
        <TouchableOpacity>
          
        </TouchableOpacity>
      <View style={{height: 60, width: 80, position: 'absolute'}}>
        <Image
          source={require('../../assets/image/post/img_3.jpg')}
          style={{
            height: 300,
            width: '100%',
            resizeMode: 'cover',
            borderTopLeftRadius: 15,
            borderTopLeftRadius: 15,
          }}
        />
      </View>
    </View>
  );
};

export default sessionPlan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
