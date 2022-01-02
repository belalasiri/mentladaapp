import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import {COLORS, icons, SIZES} from '../../../../constants';

const CommentContainer = ({sendComment, setComment, input}) => {
  return (
    <View style={styles.footer}>
      <TextInput
        value={input}
        multiline
        onChangeText={sendComment}
        onSubmitEditing={sendComment}
        placeholder="Type your comment"
        style={styles.textInput}
      />
      <TouchableOpacity onPress={sendComment} activeOpacity={0.5}>
        <Image
          source={icons.send}
          style={{
            width: 25,
            height: 25,
            tintColor: COLORS.primary,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CommentContainer;

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    paddingHorizontal: SIZES.padding * 2 - 5,
  },
  textInput: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    marginRight: 15,
    textAlign: 'left',
    backgroundColor: COLORS.lightpurple,
    color: COLORS.secondary,
    overflow: 'hidden',
    flexWrap: 'wrap',
  },
});
