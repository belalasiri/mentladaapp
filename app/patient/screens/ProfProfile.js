import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import FormButton from '../../config/components/FormButton';
import colors from '../../config/colors';
import font from '../../config/font';
import ProfInfo from '../../config/components/ProfInfo';
import SpecialityCard from '../../config/components/SpecialityCard';

import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../navigation/AuthProvider';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {NavigationActions} from '@react-navigation/native';

const ProfProfile = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [Profdata, setProfdata] = useState(null);
  const [isApproved, setIsApproveddata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  let profList = [];
  const fetchProf = async () => {
    await firestore()
      .collection('Professional')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          profList.push({
            id: doc.id,
            fname: doc.data().fname,
            lname: doc.data().lname,
            email: doc.data().email,
            about: doc.data().about,
            Experience: doc.data().Experience,
            License: doc.data().License,
            Specialty: doc.data().Specialty,
            userImg: doc.data().userImg,
          });
        });
      })
      .catch(e => {
        console.log(e);
      });
    setProfdata(profList);

    if (loading) {
      setLoading(false);
    }
  };

  const checkApproval = async () => {
    await firestore()
      .collection('session')
      .doc(auth().currentUser.email + route.params.profEmail)
      .get()
      .then(result => {
        if (result.exists) {
          setIsApproveddata(result.data().approved);
          console.log(result.data().approved);
        } else {
          setIsApproveddata('notExist');
        }
      })
      .catch(e => {
        console.log(e);
      });

    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApproval();
    getUser();
    fetchProf();
  }, []);
  
  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };


  const onRequest = () => {
    firebase
      .firestore()
      .collection('session')
      .doc(auth().currentUser.email + route.params.profEmail)
      .set({
        approved: 'pending',
        isRequested: route.params.userEmail + route.params.profEmail,
        patientName: route.params.userName,
        patientEmail: route.params.userEmail,
        patientAvatar: route.params.userAvatar,
        professionalName: route.params.profName,
        profEmail: route.params.profEmail,
        professionalAvatar: route.params.profAvatar,
      })
      .then(() => {
        console.log('Request Sent!');
        setLoading(true);
        Alert.alert(
          'Request Sent!',
          'Your Request has sent successfully. please wait for the profissinal to approve you request. Thank you',
        );
      });
  };
  const onDelete = () => {
    firebase
      .firestore()
      .collection('session')
      .doc(auth().currentUser.email + route.params.profEmail)
      .delete()
      .then(() => {
        console.log('Your request has been cancel!');
        setLoading(true);
        Alert.alert('Request Cenceled!', '');
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        // paddingHorizontal: 15,
      }}>
      {/* Profile pic and name with Specialty */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.Heder}>
          <View style={styles.Left} />
          <View style={styles.Right} />
        </View>
        <View style={{paddingHorizontal: 15}}>
          <View style={styles.Hedercontainer}>
            {/* Profile pic */}
            <Image
              style={styles.ProfileImage}
              source={{
                uri: Profdata
                  ? route.params.profAvatar ||
                    'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1'
                  : 'https://gcdn.pbrd.co/images/in5sUpqlUHfV.png?o=1',
              }}
              // source={require('../../assets/image/users/user_1.jpg')}
            />

            {/* Profile name and Specialty */}
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: font.title,
                  paddingTop: 10,
                  color: colors.text,
                }}>
                {route.params.profName}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: font.subtitle,
                  color: colors.primary,
                }}>
                Cognitive psychologist
              </Text>
            </View>
          </View>

          {/* Prof info continer */}
          <View style={styles.ProfCont}>
            <ProfInfo
              icon="star"
              iconColor="#ffde9f"
              backgroundColor="#fff8ea"
              Title1="4.98"
              Title2="Reviews"
            />
            <ProfInfo
              icon="person"
              iconColor="#67d8af"
              backgroundColor="#e1f7ef"
              Title1="122"
              Title2="Patients"
            />
            <ProfInfo
              icon="checkmark-done-circle"
              iconColor="#61edea"
              backgroundColor="#dffbfb"
              Title1="10 years"
              Title2="Experience"
            />
          </View>
          <View style={{paddingTop: 15}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.title,
                color: colors.text,
              }}>
              Professionals for you
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: font.subtitle,
                color: colors.subtext,
                paddingTop: 5,
              }}>
              I am a Licensed Professional Counselor in Malaysia - Kuala Lumpur,
              practising as a Clinical Case Manager at Ampang Hospital –
              Behavioral Health
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#F5F7F9',
              marginTop: 15,
              borderRadius: 7,
            }}>
            <View style={{margin: 10, alignItems: 'center'}}>
              <Icon name="document-text" size={25} color="#6D768E" />

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 15, fontFamily: font.title}}>LPC </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#B283E4',
                    fontFamily: font.title,
                  }}>
                  2016017861
                </Text>
              </View>
              <Text style={{fontSize: 12, fontFamily: font.subtitle}}>
                License
              </Text>
            </View>
          </View>
          <View style={{paddingTop: 15}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.title,
                color: colors.text,
              }}>
              Specialities
            </Text>
            <View style={{flexDirection: 'row'}}>
              <ScrollView horizontal>
                <SpecialityCard text="Stress" />
                <SpecialityCard text="Anxiety" />
                <SpecialityCard text="Addictions" />
                <SpecialityCard text="Family conflicts" />
                <SpecialityCard text="Anger management" />
                <SpecialityCard text="Self-Esteem" />
                <SpecialityCard text="Depression" />
              </ScrollView>
            </View>
          </View>
          {isApproved == 'notExist' ? (
            <View style={{paddingBottom: 10}}>
              <FormButton
                buttonTitle="Request for a counselling session"
                onPress={() => onRequest()}
              />
            </View>
          ) : isApproved == 'pending' ? (
            <View style={{paddingBottom: 10}}>
              <View style={[styles.containerLoading, styles.horizontal]}>
                <FormButton buttonTitle="Cancel" onPress={() => onDelete()} />
              </View>
            </View>
          ) : isApproved == 'approved' ? (
            <View style={{paddingBottom: 10}}>
              <FormButton
                buttonTitle="Chat"
                onPress={() => navigation.navigate('Messages')}
              />
            </View>
          ) : (
            <View style={{paddingBottom: 10}}>
              <View style={[styles.containerLoading, styles.horizontal]}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfProfile;

const styles = StyleSheet.create({
  Heder: {
    position: 'absolute',
    width: '100%',
    top: -50,
    zIndex: -100,
  },
  Left: {
    backgroundColor: colors.secoundary,
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    left: -50,
    top: -50,
  },
  Right: {
    backgroundColor: colors.primary,
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    right: -100,
    top: -200,
  },
  Hedercontainer: {
    alignItems: 'center',
    paddingTop: 15,
    
  },
  ProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 70,
  },
  ProfCont: {
    flexDirection: 'row',
    paddingTop: 15,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 3,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  cardText: {
    fontSize: 14,
  },
});
