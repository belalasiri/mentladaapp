import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS, FONTS, icons, SIZES} from '../../../../constants';
import {Divider} from '../../../styles/FeedStyles';

const FooterContainer = ({
  CommentsLength,
  disLikeThePost,
  likeThePost,
  isLiked,
  likedCount,
  likerID,

  authUser,
  docUser,
}) => {
  return (
    <View
      style={{
        paddingHorizontal: SIZES.padding * 2,
        paddingVertical: SIZES.padding,
      }}>
      <View style={styles.container}>
        <Pressable style={styles.iconContainer} onPress={likeThePost}>
          <Image
            source={icons.heart}
            style={{width: 20, height: 20, tintColor: COLORS.secondary}}
          />
          <Text style={styles.number}>{likedCount}</Text>
        </Pressable>

        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* <Image
          source={icons.commentIcon}
          style={{width: 22, height: 22, marginRight: SIZES.padding}}
        /> */}
          <Text
            style={{
              ...FONTS.h4,
              color: COLORS.secondary,
              paddingHorizontal: SIZES.padding,
            }}>
            {CommentsLength}
          </Text>
          <Text style={{...FONTS.body5, color: COLORS.secondary}}>
            comments
          </Text>
        </Pressable>
      </View>
      {/* <Divider /> */}
      <View
        style={{
          borderWidth: 1,
          borderColor: COLORS.lightpurple,
          margin: SIZES.padding,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </View>
  );
};

export default FooterContainer;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  number: {
    marginLeft: 5,
    textAlign: 'center',
  },
});
