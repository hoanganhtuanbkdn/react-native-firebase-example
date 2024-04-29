import React, { memo } from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { cn } from '../utils';

function MyButton({ onPress, title, rootClassName, type, size = 'medium', disabled, loading }) {
  let styleDefault = 'bg-main';
  let styleTextDefault = 'text-button';
  if (type === 'danger') {
    styleDefault = 'bg-danger';
    styleTextDefault = 'text-[#D11717]';
  }

  if (size === 'small') {
    styleDefault += ' h-10';
  }
  if (size === 'medium') {
    styleDefault += ' h-[54px]';
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={cn('w-full rounded-lg  flex items-center justify-center', styleDefault, rootClassName)}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text className={cn('font-semibold text-lg', styleTextDefault)}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
export default memo(MyButton);
