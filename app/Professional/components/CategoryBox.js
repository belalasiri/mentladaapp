import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import font from '../../config/font';
import colors from '../../config/colors';

import {windowWidth} from '../../utils/Dimentions';

const CategoryBox = ({Title, onPress, image}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.boxContainer}
      activeOpacity={0.8}>
      <LinearGradient
        colors={['#f0e6fa', '#fff', '#f7f3fc']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={styles.boxGred}>
        <Image
          source={image}
          style={{width: '80%', height: '80%', resizeMode: 'contain'}}
        />

        <View style={styles.cardDetails}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.Title}>{Title}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CategoryBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  boxGred: {
    marginHorizontal: 15,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 7,
    height: 200,
    zIndex: 100,
    width: windowWidth / 2 - 30,
    padding: 10,
  },
  boxContainer: {
    margin: 10,
    height: 200,
    width: windowWidth / 2 - 30,
    borderRadius: 7,
    justifyContent: 'center',
    elevation: 0.7,
    alignItems: 'center',
  },
  card: {
    height: 280,
    width: windowWidth / 2 - 30,
    elevation: 4,
    marginRight: 10,
    borderRadius: 7,
    backgroundColor: '#fff',
  },

  cardDetails: {
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Title: {fontFamily: font.title, fontSize: 15, color: colors.text},
});
