import React, { memo } from 'react';
import { TextInput } from 'react-native';

export default memo(function MyInput(props) {
  return <TextInput autoCapitalize="none" autoCorrect={false} {...props} />;
});
