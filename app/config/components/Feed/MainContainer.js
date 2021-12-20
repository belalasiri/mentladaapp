import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {windowHeight} from '../../../utils/Dimentions';
import colors from '../../colors';
import font from '../../font';
import ProgressiveImage from '../ProgressiveImage';
import Footer from './Footer';

const MainContainer = ({
  Name,
  postTime,
  IconName,
  PostContent,
  conPostImage,
  postImage,
  userUid,
  itemuserId,
  onPress,
  onDelete,
  onImagePress,
}) => {
  return (
    <View style={styles.Container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.UserNameAndtimeContainer}
          onPress={onPress}>
          <Text style={styles.UserName}>{Name}</Text>
          <Text style={styles.Time}>{postTime}</Text>
        </TouchableOpacity>

        {userUid == itemuserId ? (
          <TouchableOpacity onPress={onDelete}>
            <Feather name={IconName} size={25} color={colors.primary} />
          </TouchableOpacity>
        ) : null}
      </View>
      <Text style={styles.Content}>{PostContent}</Text>
      <TouchableOpacity style={{marginVertical: 10}} onPress={onImagePress}>
        {conPostImage != null ? (
          <ProgressiveImage
            defaultImageSource={require('../../../assets/image/default-img.jpg')}
            source={postImage}
            style={{
              height: 300,
              width: '100%',
              borderRadius: 10,
              overflow: 'hidden',
            }}
            resizeMode="cover"
          />
        ) : null}
      </TouchableOpacity>
      {/* <Footer /> */}
    </View>
  );
};

export default MainContainer;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    marginHorizontal: 10,
    // backgroundColor: colors.w,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  UserNameAndtimeContainer: {
    flexDirection: 'row',
  },
  UserName: {
    fontSize: 15,
    fontFamily: font.title,
    color: colors.text,
  },
  Time: {
    fontSize: 11,
    fontFamily: font.subtitle,
    color: colors.subtext,
    marginHorizontal: 5,
    marginTop: 5,
  },
  Content: {
    fontSize: 14,
    fontFamily: font.subtitle,
    color: colors.text,
    lineHeight: 22,
    marginTop: 5,
  },
});
