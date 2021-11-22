import React, {useEffect, useState, useContext} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import firestore, {firebase} from '@react-native-firebase/firestore';
import {AuthContext} from '../../navigation/AuthProvider';

const ProfHome = ({navigation, route}) => {
  const {user, Proflogout} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  const getUser = async () => {
    await firestore()
      .collection('Professional')
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text>ProfHome Screen </Text>
      <Text style={styles.userName}>
        {userData ? userData.fname || 'Mentlada' : 'Mentlada'}{' '}
        {userData ? userData.lname || 'Patient' : 'Patient'}
      </Text>
      <TouchableOpacity style={styles.userBtn_L} onPress={() => Proflogout()}>
        <Text style={styles.userBtnTxt}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
