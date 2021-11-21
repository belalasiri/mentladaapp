import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import FormButton from '../../config/components/FormButton';
import colors from '../../config/colors';
import font from '../../config/font';
import ProfInfo from '../../config/components/ProfInfo';
import SpecialityCard from '../../config/components/SpecialityCard';

const Prof = [
  {
    id: '1',
    // ProfName: 'Dr. Belal Asiri',
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
    // ProfName: 'Dr. Amer',
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
];

const ProfProfile = ({route, item, navigation}) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
      }}>
      {/* Profile pic and name with Specialty */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.Hedercontainer}>
          {/* Profile pic */}
          <Image
            style={styles.ProfileImage}
            source={require('../../assets/image/users/user_1.jpg')}
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
              {route.params.ProfName}
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
            style={{fontSize: 16, fontFamily: font.title, color: colors.text}}>
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
          style={{backgroundColor: '#F5F7F9', marginTop: 15, borderRadius: 7}}>
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
            style={{fontSize: 16, fontFamily: font.title, color: colors.text}}>
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
        <View style={{paddingBottom: 10}}>
          <FormButton
            buttonTitle="+ Book counselling session"
            onPress={() => navigation.navigate('Blog')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfProfile;

const styles = StyleSheet.create({
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
