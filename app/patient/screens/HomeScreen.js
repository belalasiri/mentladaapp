import React, {useState, useEffect, useContext, version} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';

import font from '../../config/font';
import Icon from 'react-native-vector-icons/Ionicons';

import {AuthContext} from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

const Prof = [
  {
    id: '1',
    ProfFname: 'Dr.Belal',
    ProfLname: 'Asiri',
    ProfImg: require('../../assets/image/users/user_1.jpg'),
    ProfSpecialty: 'Cognitive psychologist',
    ProfReviews: '4.99',
    ProfPatients: '20',
    ProfExperienceTime: '10 years',
    ProfExperience: 'Cognitive psychologist',
    ProfLicenses: 'LPC 2016017861',
    ProfAbout:
      'I am a Licensed Professional Counselor in Malaysia - Kuala Lumpur, practising as a Clinical Case Manager at Ampang Hospital – Behavioral Health.',
  },
  {
    id: '2',
    ProfFname: 'Dr.Amer',
    ProfLname: 'Love',
    ProfImg: require('../../assets/image/users/user_2.jpg'),
    ProfSpecialty: 'Psychologist',
    ProfReviews: '4.12',
    ProfPatients: '320',
    ProfExperienceTime: '2 years',
    ProfExperience: 'Cognitive psychologist',
    ProfLicenses: 'LPC 2014427861',
    ProfAbout:
      'I am a Licensed Professional Counselor in Yemen - Ibb, practising as a Clinical Case Manager at Ibb Hospital – Behavioral Health.',
  },
  {
    id: '3',
    ProfFname: 'Dr.Hanan',
    ProfLname: 'Alatas',
    ProfImg: require('../../assets/image/users/user_5.jpg'),
    ProfSpecialty: 'Psychologist',
    ProfReviews: '4.97',
    ProfPatients: '12',
    ProfExperienceTime: '1 year',
    ProfExperience: 'Cognitive psychologist',
    ProfLicenses: 'LPC 3129982812',
    ProfAbout:
      'I am a Licensed Professional Counselor in Yemen - Ibb, practising as a Clinical Case Manager at Ibb Hospital – Behavioral Health.',
  },
];

const HomeScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [Profdata, setProfdata] = useState(null);

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          // console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#C2EFDF',
      }}>
      {/* Header */}
      <View
        style={{
          paddingTop: 10,
          marginVertical: 20,
          paddingHorizontal: 20,
        }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: font.subtitle,
          }}>
          How are you today{' '}
          {userData ? userData.fname || 'Mentlada' : 'Patient'}?
        </Text>
        <Text style={styles.textTitle}>Hi, Welcome</Text>
      </View>

      <View style={styles.container}>
        <Text style={{fontSize: 16, fontFamily: font.title, paddingTop: 23}}>
          Professionals for you
        </Text>

        <FlatList
          data={Prof}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.Card}
              onPress={() =>
                navigation.navigate('ProfProfile', {
                  ProfName: item.ProfFname + ' ' + item.ProfLname,
                })
              }>
              <View style={styles.ProfInfo}>
                <Image style={styles.ProfImg} source={item.ProfImg} />
                <View style={styles.ProfNameCont}>
                  <Text style={styles.ProfName}>
                    {item.ProfFname + ' ' + item.ProfLname}
                  </Text>
                  <Text style={styles.ProfDes}>{item.ProfSpecialty}</Text>
                </View>
              </View>
              <View style={styles.ProfCont}>
                <View style={{flex: 1, margin: 5}}>
                  <View
                    style={{
                      backgroundColor: '#fff8ea',
                      alignItems: 'center',
                      borderRadius: 7,
                      padding: 10,
                    }}>
                    <Icon name="star" size={20} color="#ffde9f" />
                    <Text style={{fontSize: 16, fontFamily: font.title}}>
                      {item.ProfReviews}
                    </Text>
                    <Text style={{fontSize: 12, fontFamily: font.subtitle}}>
                      Reviews
                    </Text>
                  </View>
                </View>
                <View style={{flex: 1, margin: 5}}>
                  <View
                    style={{
                      backgroundColor: '#e1f7ef',
                      alignItems: 'center',
                      borderRadius: 7,
                      padding: 10,
                    }}>
                    <Icon name="person" size={20} color="#67d8af" />

                    <Text style={{fontSize: 16, fontFamily: font.title}}>
                      {item.ProfPatients}
                    </Text>
                    <Text style={{fontSize: 12, fontFamily: font.subtitle}}>
                      Patients
                    </Text>
                  </View>
                </View>
                <View style={{flex: 1, margin: 5}}>
                  <View
                    style={{
                      backgroundColor: '#dffbfb',
                      alignItems: 'center',
                      borderRadius: 7,
                      padding: 10,
                    }}>
                    <Icon
                      name="checkmark-done-circle"
                      size={20}
                      color="#61edea"
                    />
                    <Text style={{fontSize: 16, fontFamily: font.title}}>
                      {item.ProfExperienceTime}
                    </Text>
                    <Text style={{fontSize: 12, fontFamily: font.subtitle}}>
                      Experience
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // marginVertical: 20,
    paddingHorizontal: 20,
  },
  Card: {
    backgroundColor: '#F5F7F9',
    // backgroundColor: colors.w,
    width: '100%',
    // marginBottom: 20,
    marginTop: 10,
    borderRadius: 7,
  },
  ProfInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 15,
    alignItems: 'center',
    // marginLeft: 10,
  },
  ProfImg: {
    width: 50,
    height: 50,
    borderRadius: 70,
  },
  ProfInfoText: {
    marginLef: 10,
    fontSize: 12,
  },
  ProfName: {
    fontSize: 16,
    fontFamily: font.title,
  },
  ProfDes: {
    fontSize: 12,
    fontFamily: font.title,
  },
  ProfNameCont: {
    flexDirection: 'column',
    paddingLeft: 7,
    marginTop: -4,
  },
  ProfCont: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingRight: 15,
    paddingLeft: 15,
    paddingBottom: 15,
    alignItems: 'center',
    // marginLeft: 10,
  },
});

{
  /* <View style={{paddingTop: 10, paddingHorizontal: 20, marginVertical: 20}}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: font.subtitle,
          }}>
          How are you today{' '}
          {userData ? userData.fname || 'Mentlada' : 'Patient'}?
        </Text>
        <Text style={styles.textTitle}>Hi, Welcome</Text>
      </View> */
}

{
  /* <FlatList
        data={Prof}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          
        )}
      />
          <TouchableOpacity style={{flex: 1, paddingTop: 15}}>
            <View
              style={{
                width: '100%',
                height: '60%',
                backgroundColor: colors.primary,
              }}>
              <View>
                <Text>{item.ProfName}</Text>
              </View>
              <Text>ProfAbout {item.ProfAbout}</Text>
            </View>
            <Text>ProfPatients {item.ProfPatients}</Text>
       
          </TouchableOpacity>
        )}
      /> */
}

{
  /* <TouchableOpacity onPress={() => navigation.navigate('ProfProfile')}>
          <Text>Hi</Text>
        </TouchableOpacity> */
}
