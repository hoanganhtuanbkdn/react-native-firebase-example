import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import UserInformation from '../../components/UserInformation';
import { useAuthStore } from '../../store/AuthStore';

export default function SchoolScreen({ navigation, route }) {
  const profile = useAuthStore((state) => state.profile);

  const startTime = profile[`school${route.params.level}Start`] || '';

  useEffect(() => {
    navigation.setOptions({ title: route.params.title });
  }, []);

  return (
    <View className="flex-1 bg-background">
      <UserInformation />
      <View className="items-center flex-1 p-6">
        <View className="w-full  space-y-3">
          <View className="p-6 bg-header">
            <Text className="font-semibold text-main text-center"> 📢 Important Announcement</Text>
            <Text className=" text-main mt-3 ">
              {`Starting ${startTime},\nschool will commence 15 minutes earlier. Adjust your schedules accordingly.\nThank you! 📚🔔 \nMorning: 7-11 A.M \nAfternoon: 2-5 P.M]`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
