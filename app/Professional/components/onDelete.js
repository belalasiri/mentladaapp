import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import AuthorCustom from './AuthorCustom';

const onDelete = ({onDeletePost, routeId}) => {
  return <AuthorCustom onDelete={() => onDeletePost({routeId})} />;
};

export default onDelete;
