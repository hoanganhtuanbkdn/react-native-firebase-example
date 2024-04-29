import React from 'react';
import { View, Text, Alert } from 'react-native';
import UserInformation from '../../components/UserInformation';
import MyButton from '../../components/MyButton';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../store/AuthStore';
import { updateCollection } from '../../firebaseConfig';

export default function CareerDetailScreen({ navigation, route }) {
  const profile = useAuthStore((state) => state.profile);
  const handleApply = () => {
    Alert.alert('Apply Career', 'You are sure you want to apply for this job ', [
      { text: 'Cancel', type: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          await updateCollection('users', profile.email, {
            job: route.params,
          });
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Applied successfully👋',
          });
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <UserInformation />
      <View className="items-center flex-1 p-6">
        <View className="w-full p-6 items-center bg-header">
          <Text className="text-main font-semibold">{route.params ? route.params.name : '-'}</Text>
        </View>
        <View className="w-full gap-y-3 mt-3 bg-header p-4">
          {route.params &&
            route.params.description.map((content, index) => (
              <Text key={index} className=" font-semibold text-white">
                {content}
              </Text>
            ))}
        </View>
        <MyButton title="Apply" rootClassName="rounded-none mt-6" onPress={handleApply} />
      </View>
    </View>
  );
}
