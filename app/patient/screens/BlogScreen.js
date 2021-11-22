import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const BlogScreen = () => {

const fetchProfs = async () => {
  try {
    const profList = [];

    await firestore()
      .collection('Professional')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const {userId, post, postImg, postTime, likes, comments} = doc.data();
          profList.push({
            id: doc.id,
            userId,
            userName,
            userImg: 'https://i.ibb.co/pv5S0nm/logo.png',
            postTime: postTime,
           
          });
        });
      });
    setPosts(profList);

    if (loading) {
      setLoading(false);
    }

    // console.log('Posts: ', profList);
  } catch (e) {
    console.log(e);
  }
};


  return (
    <View style={styles.container}>
      <Text>BlogScreen Screen </Text>
    </View>
  );
};

export default BlogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   },
});