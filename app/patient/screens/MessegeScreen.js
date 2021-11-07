import React from 'react';
import {Text, ScrollView, StyleSheet} from 'react-native';
import colors from '../../config/colors';
import font from '../../config/font';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const MessageScreen = () => {
  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{alignItems: 'center'}}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginTop={20}>
          <SkeletonPlaceholder.Item width={60} height={60} />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item
              width={120}
              height={20}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={80}
              height={20}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          marginTop={6}
          width={300}
          height={20}
          borderRadius={4}
        />
        <SkeletonPlaceholder.Item
          marginTop={6}
          width={250}
          height={20}
          borderRadius={4}
        />
        <SkeletonPlaceholder.Item
          marginTop={6}
          width={350}
          height={200}
          borderRadius={4}
        />
      </SkeletonPlaceholder>

      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginTop={20}>
          <SkeletonPlaceholder.Item width={60} height={60} />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item
              width={120}
              height={20}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={80}
              height={20}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          marginTop={6}
          width={300}
          height={20}
          borderRadius={4}
        />
        <SkeletonPlaceholder.Item
          marginTop={6}
          width={250}
          height={20}
          borderRadius={4}
        />
        <SkeletonPlaceholder.Item
          marginTop={6}
          width={350}
          height={200}
          borderRadius={4}
        />
      </SkeletonPlaceholder>

      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginTop={20}>
          <SkeletonPlaceholder.Item width={60} height={60} />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item
              width={120}
              height={20}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={80}
              height={20}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          marginTop={6}
          width={300}
          height={20}
          borderRadius={4}
        />
        <SkeletonPlaceholder.Item
          marginTop={6}
          width={250}
          height={20}
          borderRadius={4}
        />
        <SkeletonPlaceholder.Item
          marginTop={6}
          width={350}
          height={200}
          borderRadius={4}
        />
      </SkeletonPlaceholder>
      {/* <Text style={styles.text}>Message Screen</Text> */}
    </ScrollView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.w,
    marginTop: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: colors.text,

    fontFamily: font.title,
  },
});
