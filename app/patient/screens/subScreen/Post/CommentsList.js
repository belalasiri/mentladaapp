import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {COLORS, icons, SIZES, FONTS} from '../../../../constants';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Avatar} from 'react-native-elements';
import NameContainer from './NameContainer';
import {BallIndicator, BarIndicator} from 'react-native-indicators';
import moment from 'moment';

const CommentsList = ({item, navigation, deleting, onDelete}) => {
  const [userData, setUserData] = useState(null);
  const [profData, setProfData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(item.CommenterId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
    setLoading(false);
  };
  const getProf = async () => {
    await firestore()
      .collection('Professional')
      .doc(item.CommenterId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setProfData(documentSnapshot.data());
        }
      });
    setLoading(false);
  };

  useEffect(() => {
    getUser();
    getProf();
  }, [userData, profData]);

  let userName = (
    <Text>
      {userData
        ? userData.fname + ' ' + userData.lname || 'Mentlada user'
        : 'Mentlada user'}
    </Text>
  );

  let userUID = (
    <Text>
      {userData
        ? userData.userId + ' ' + userData.userId || 'ssssssaas'
        : 'ssssssss'}
    </Text>
  );
  let postTime = moment(item.CommentTime.toDate()).fromNow();

  return (
    <View
      style={{
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: SIZES.padding,
        marginVertical: 5,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{alignSelf: 'flex-start'}}>
          <Avatar
            rounded
            size={35}
            source={{
              uri: userData
                ? userData.userImg || 'https://i.ibb.co/2kR5zq0/Final-Logo.png'
                : 'https://i.ibb.co/2kR5zq0/Final-Logo.png',
            }}
          />
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.lightGray,
            marginLeft: 5,
            borderRadius: SIZES.base,
            paddingVertical: SIZES.padding,
            borderWidth: 1,
            borderColor: COLORS.lightpurple,
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexDirection: 'row',
              paddingHorizontal: SIZES.padding * 1.4,
            }}>
            <Text style={{...FONTS.h6, color: COLORS.secondary}}>
              {userData ? userData.fname + ' ' + userData.lname || null : null}
              {profData
                ? 'Dr.' + profData.fname + ' ' + profData.lname || null
                : null}
            </Text>
            <Text style={{...FONTS.body6, color: COLORS.secondary}}>
              {postTime}
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: SIZES.padding * 1.4,
              paddingVertical: SIZES.padding - 5,
            }}>
            <Text style={{...FONTS.body4, color: COLORS.secondary}}>
              {item.Comment}
            </Text>
          </View>
        </View>

        {item.CommenterId != auth().currentUser.uid ? null : (
          <TouchableOpacity onPress={() => onDelete()}>
            <Image
              source={icons.Delete}
              style={{
                width: 20,
                height: 20,
                tintColor: COLORS.primary,
                marginLeft: 5,
              }}
            />
          </TouchableOpacity>
        )}
      </View>
      {/* <Text>{item.Comment}</Text> */}
    </View>
  );
};

export default CommentsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: SIZES.padding,
  },
});
