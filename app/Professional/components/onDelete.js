import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import AuthorCustom from './AuthorCustom';

const onDelete = ({onDelete, routeId}) => {
  return <AuthorCustom onDelete={() => onDelete({routeId})} />;
};

export default onDelete;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
