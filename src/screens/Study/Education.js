import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import UserInformation from '../../components/UserInformation';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUserStore } from '../../store/UserStore';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/AuthStore';

export default function EducationScreen({ navigation }) {
  const age = useUserStore((state) => state.age);
  const profile = useAuthStore((state) => state.profile);

  const { isSchool1Completed, isSchool2Completed, isSchool3Completed, isSchool4Completed } = profile || {};

  const Educations = [
    {
      title: 'Primary School',
      minAge: 6,
      maxAge: 10,
      level: 1,
      isCompleted: isSchool1Completed,
    },
    {
      title: 'Secondary School',
      minAge: 11,
      maxAge: 14,
      level: 2,
      isCompleted: isSchool2Completed,
    },
    {
      title: 'Hight School',
      minAge: 15,
      maxAge: 17,
      level: 3,
      isCompleted: isSchool3Completed,
    },
    {
      title: 'University',
      minAge: 18,
      maxAge: 22,
      level: 4,
      isCompleted: age > 25,
    },
  ];

  const handleEducationDetail = (item) => {
    if (item.minAge > age) {
      Alert.alert('Program Locking', 'You are not old enough to study this program.', [
        { text: 'OK', onPress: () => {} },
      ]);
    } else {
      navigation.navigate('EducationDetail', { ...item });
    }
  };
  return (
    <View className="flex-1 bg-background">
      <UserInformation />
      <View className="items-center flex-1 p-6">
        <View className="w-full px-3 divide-y divide-white bg-header">
          {Educations.map((item) => (
            <TouchableOpacity
              onPress={() => handleEducationDetail(item)}
              className="flex-row items-center justify-between py-3"
              key={item.title}
            >
              <Text className="flex-1 font-semibold text-main">{item.title}</Text>
              <View className="flex-row items-center justify-between flex-1">
                <View className="flex-row items-center justify-between flex-1">
                  <Text className="font-semibold text-main">Status:</Text>
                  <View className="flex items-center justify-center flex-1">
                    {item.isCompleted && item.minAge <= age && age >= item.maxAge && (
                      <Text className="font-semibold text-main">Completed</Text>
                    )}
                    {item.minAge <= age && !item.isCompleted && (
                      <Text className="font-semibold text-main">In-school</Text>
                    )}
                    {item.minAge > age && <Ionicons name="lock-closed" size={20} color="#fff" />}
                  </View>
                </View>
                <View>
                  <MaterialIcons name="arrow-forward-ios" size={16} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
