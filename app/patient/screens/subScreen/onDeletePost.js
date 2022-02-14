import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import CustomDeleteButton from './CustomDeleteButton';

const onDeletePost = ({onDeleteCus, routeId}) => {
  return <CustomDeleteButton onDelete={() => onDeleteCus({routeId})} />;
};

export default onDeletePost;
