import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
} from 'react-native';

import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../config/colors';
import font from '../../config/font';
import {windowWidth} from '../../utils/Dimentions';
import DatePicker from 'react-native-date-picker';
import MonthPicker from 'react-native-month-year-picker';

import {Avatar} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

const planDetails = ({navigation, route}) => {
  const [cardDetails, setCardDetails] = useState();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState();
  const [name, setName] = useState();
  const [cardNumber, setCardNumber] = useState('');
  const [CVC, setCVC] = useState();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const plan = route.params;

  const Content = ({HederText, Body, Body2, Price, priceInfo, onPress}) => {
    return (
      <>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingLeft: 15,
            }}>
            <Text
              style={{
                fontSize: 15,
                color: colors.text,
                fontFamily: font.title,
              }}>
              {HederText}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.subtext,
                fontFamily: font.subtitle,

                textAlign: 'center',
              }}>
              {Body}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.subtext,
                fontFamily: font.subtitle,

                textAlign: 'center',
              }}>
              {Body2}
            </Text>

            <Text
              style={{
                fontSize: 11,
                color: colors.subtext,
                fontFamily: font.title,
                textAlign: 'center',
              }}>
              {priceInfo}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const onCancel = () => {
    navigation.goBack();
    ToastAndroid.showWithGravityAndOffset(
      'Add post Canceled',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      0,
      200,
    );
  };
  const submitPlan = () => {
    firestore()
      .collection('packages')
      .doc(auth().currentUser.uid)
      .set({
        seconds: 480000,
        NameOnCard: name,
        cardNumber: cardNumber,
        CVC: CVC,
        expiryDate: date,
      })
      .then(() => {
        navigation.goBack();
        console.log('successfully subscribed!');
        Alert.alert(
          `You have successfully subscribed to our ${plan.HederText} plan. `,
          'Your profile has been updated successfully.',
        );
      });
  };
  useEffect(() => {}, [plan]);
  
  return (
    <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={80}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginBottom: 5,
          alignItems: 'flex-start',
          paddingTop: 15,
        }}>
        <Text
          style={{
            fontFamily: font.title,
            color: colors.text,
            fontSize: 16,
          }}>
          Add your payment infromation
        </Text>
      </View>

      <View>
        <Text
          style={{
            fontFamily: font.subtitle,
            color: colors.subtext,
            paddingTop: 15,
            fontSize: 14,
          }}>
          Plan infromation
        </Text>
        <LinearGradient
          colors={['#f7f3fc', '#fff', '#f7f3fc']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={{
            flexDirection: 'row',
            marginVertical: 5,
            alignItems: 'center',
            borderRadius: 7,
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            {plan.HederText == 'Premium' ? (
              <View
                style={{
                  backgroundColor: colors.primary,
                  width: windowWidth / 2 - 20,
                  borderBottomRightRadius: 30,
                  borderTopRightRadius: 30,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontFamily: font.title,
                    color: colors.w,
                    fontSize: 16,
                    paddingLeft: 20,
                  }}>
                  Best value
                </Text>
              </View>
            ) : null}

            <View style={{padding: 10}}>
              <Content
                HederText={plan.HederText}
                Body={plan.Body}
                Body2={plan.Body2}
                Price={plan.Price}
                priceInfo={plan.priceInfo}
              />
            </View>
          </View>
        </LinearGradient>
      </View>
      <Text
        style={{
          fontFamily: font.subtitle,
          color: colors.subtext,
          paddingTop: 15,
          fontSize: 14,
        }}>
        Card information
      </Text>
      <View style={styles.action}>
        <AntDesign name="user" color="#707070" size={20} />
        <TextInput
          placeholder="Name on card"
          placeholderTextColor="#707070"
          autoCorrect={false}
          value={name}
          onChangeText={userName => setName(userName)}
          style={styles.textInput}
        />
      </View>
      <View style={styles.action}>
        <Icon name="card-outline" color="#707070" size={20} />
        <TextInput
          placeholder="1234 1234 1234 1234"
          placeholderTextColor="#707070"
          returnKeyType="next"
          keyboardType={'numeric'}
          underlineColorAndroid="transparent"
          maxLength={16}
          autoCorrect={false}
          value={cardNumber}
          onChangeText={userCardNumber => setCardNumber(userCardNumber)}
          style={styles.textInput}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <DatePicker
          modal
          mode="date"
          open={open}
          date={date}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
            console.log(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginTop: 10,
            borderColor: colors.empty,
            alignItems: 'center',
            borderWidth: 2,
            borderRadius: 7,
            paddingLeft: 10,
            width: windowWidth / 3 + 80,
          }}
          //   onPress={() => setOpen(true)}>
          onPress={() => setOpen(true)}>
          <Text>{date.toUTCString()}</Text>
          {/* <TextInput
            placeholder="Date"
            placeholderTextColor="#707070"
            keyboardType="number-pad"
            autoCorrect={false}
            value={cardNumber}
            onChangeText={userCardNumber => setCardNumber(userCardNumber)}
            style={styles.textInput}
          /> */}
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            borderColor: colors.empty,
            alignItems: 'center',
            borderWidth: 2,
            borderRadius: 7,
            width: windowWidth / 3,
            paddingLeft: 10,
          }}>
          <TextInput
            placeholder="CVC"
            placeholderTextColor="#707070"
            keyboardType="number-pad"
            autoCorrect={false}
            maxLength={3}
            value={CVC}
            onChangeText={CVC => setCVC(CVC)}
            style={styles.textInput}
          />
        </View>
      </View>
      {plan.HederText == 'Premium' ? (
        <TouchableOpacity
          style={styles.button}
          onPress={submitPlan}
          disabled={loading}
          disabled={!name}
          disabled={!date}
          disabled={!cardNumber}
          disabled={!CVC}>
          {uploading ? (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size="small" color={colors.empty} />
            </View>
          ) : (
            <Text style={styles.buttonText}>PAY {plan.Price}</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={onCancel}
          disabled={loading}
          disabled={!name}
          disabled={!date}
          disabled={!cardNumber}
          disabled={!CVC}>
          {uploading ? (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size="small" color={colors.empty} />
            </View>
          ) : (
            <Text style={styles.buttonText}>PAY {plan.Price}</Text>
          )}
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

export default planDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderColor: colors.empty,
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 7,
    paddingLeft: 10,
  },

  textInput: {
    flex: 1,
    paddingLeft: 10,
    fontFamily: font.subtitle,
    fontSize: 14,
    color: colors.text,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  cancelText: {
    paddingVertical: 5,
    color: colors.text,
    fontFamily: font.title,
    paddingBottom: 7,
    fontSize: 15,
  },
  buttonText: {
    paddingHorizontal: 30,
    paddingVertical: 5,
    color: colors.empty,
    fontFamily: font.title,
    paddingBottom: 7,
    fontSize: 15,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  cancelButton: {
    borderRadius: 40,
  },
});
