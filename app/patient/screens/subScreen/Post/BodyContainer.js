import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import ProgressiveImage from '../../../../config/components/ProgressiveImage';
import {COLORS, FONTS, SIZES} from '../../../../constants';

const BodyContainer = ({
  postContent,
  onImagePress,
  conPostImage,
  postImage,
}) => {
  return (
    <View style={{}}>
      <View
        style={{
          marginVertical: SIZES.padding * 1.2,
          paddingHorizontal: SIZES.padding * 2,
        }}>
        <Text style={{...FONTS.body4, color: COLORS.secondary}}>
          {postContent}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          marginVertical: SIZES.padding - 5,
        }}>
        {conPostImage != null ? (
          <ProgressiveImage
            defaultImageSource={require('../../../../assets/image/default-img.jpg')}
            source={postImage}
            style={{
              height: 500,
              width: '100%',
              overflow: 'hidden',
            }}
            resizeMode="cover"
          />
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

export default BodyContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
