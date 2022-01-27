import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
} from 'react-native';
// DataBase
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {COLORS, FONTS, SIZES} from '../../../constants';

// libraries
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Button} from 'react-native-elements';

const FreeSession = ({navigation}) => {
  const [name, setName] = useState(null);
  const [cardNumber, setCardNumber] = useState(null);
  const [university, setUniversity] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmitRequest = () => {
    setSubmitting(true);
    firebase
      .firestore()
      .collection('packages')
      .doc(auth().currentUser.uid)
      .set({
        RequestTime: firestore.Timestamp.fromDate(new Date()),
        UserID: auth().currentUser.uid,
        // seconds: 86400,
        planCategory: 'Student',
        Price: '0',
        name: name,
        MatricNumber: cardNumber,
        university: university,
        approved: 'pending',
      })
      .then(() => {
        setSubmitting(false);
        navigation.navigate('Done');
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Free Session',
      headerStyle: {elevation: 0, backgroundColor: '#F0E6FA'},
      headerTitleStyle: {color: COLORS.secondary, ...FONTS.h5},
      headerTitleAlign: 'center',
      headerTintColor: COLORS.secondary,

      headerLeft: () => (
        <View style={{marginLeft: 10}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon name="chevron-back" size={25} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={80}>
      <ScrollView>
        <View style={{alignItems: 'flex-start'}}>
          <Text
            style={{...FONTS.h5, color: COLORS.secondary, textAlign: 'left'}}>
            Add your university information:
          </Text>
        </View>
        <View style={styles.action}>
          <AntDesign name="user" color="#707070" size={20} />
          <TextInput
            placeholder="Name on your university card"
            placeholderTextColor="#707070"
            autoCorrect={false}
            value={name}
            onChangeText={userName => setName(userName)}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome5 name="address-card" color="#707070" size={20} />
          <TextInput
            placeholder="Matric Card Number"
            placeholderTextColor="#707070"
            returnKeyType="done"
            keyboardType={'default'}
            underlineColorAndroid="transparent"
            maxLength={16}
            autoCorrect={false}
            value={cardNumber}
            onChangeText={userCardNumber => setCardNumber(userCardNumber)}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome5 name="university" color="#707070" size={20} />
          <TextInput
            placeholder="University name"
            placeholderTextColor="#707070"
            returnKeyType="done"
            keyboardType={'default'}
            underlineColorAndroid="transparent"
            // maxLength={10}
            autoCapitalize="characters"
            autoCorrect={true}
            value={university}
            onChangeText={txt => setUniversity(txt)}
            style={styles.textInput}
          />
        </View>
      </ScrollView>
      <View style={{}}>
        <Button
          title={'Request free session'}
          titleStyle={{...FONTS.h6, color: COLORS.primary}}
          loading={submitting ? true : false}
          onPress={onSubmitRequest}
          disabled={!name}
          //   disabled={!date}
          disabled={!cardNumber}
          //   disabled={!CVC}
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
    </KeyboardAvoidingView>
  );
};

export default FreeSession;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 10,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderColor: COLORS.lightpurple,
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 7,
    paddingLeft: 10,
  },

  textInput: {
    flex: 1,
    paddingLeft: 10,
    ...FONTS.body4,
    fontSize: 14,
    color: COLORS.secondary,
  },
});
