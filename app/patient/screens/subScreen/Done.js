import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import {COLORS, FONTS, icons, SIZES} from '../../../constants';

const Done = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={icons.done}
            style={{
              width: 250,
              height: 300,
            }}
          />
          <View style={{marginTop: 10, width: '90%'}}>
            <Text
              style={{
                textAlign: 'center',
                ...FONTS.h4_2,
                color: COLORS.secondary,
              }}>
              Your request has been sent
            </Text>
            <Text
              style={{
                textAlign: 'center',
                ...FONTS.body4,
                paddingTop: 10,
                color: COLORS.secondary,
              }}>
              We have received and processed your request, and it is now
              awaiting approval. We will notify you as soon as the request
              approves.
            </Text>
          </View>
        </View>
      </View>

      <View style={{marginBottom: 20}}>
        <Button
          title={'Go to home'}
          titleStyle={{...FONTS.h6, color: COLORS.primary}}
          onPress={() => navigation.navigate('Home')}
          loadingProps={{
            size: 'small',
            color: COLORS.primary,
          }}
          buttonStyle={{
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 7,
            backgroundColor: COLORS.lightpurple,
          }}
          containerStyle={{
            alignSelf: 'center',
            justifyContent: 'center',
            width: SIZES.width - 40,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Done;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});
