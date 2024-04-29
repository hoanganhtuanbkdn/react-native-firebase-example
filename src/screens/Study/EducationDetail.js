import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import UserInformation from '../../components/UserInformation';
import MyButton from '../../components/MyButton';
import { useUserStore } from '../../store/UserStore';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/AuthStore';

export default function EducationDetailScreen({ navigation, route }) {
  const { age } = useUserStore((state) => state);
  const profile = useAuthStore((state) => state.profile);

  const schoolSelected = profile[`school${route.params.level}Name`];
  const startTime = profile[`school${route.params.level}Start`] || '';

  const isCompleted = profile && profile[`isSchool${route.params.level}Completed`];

  useEffect(() => {
    navigation.setOptions({ title: route.params.title });
  }, []);

  const Educations = [
    {
      title: 'Choose School',
      route: 'SelectSchool',
    },
    {
      title: 'Subjects',
      route: schoolSelected ? 'Subject' : 'SelectSchool',
    },
    {
      title: `Start time: ${startTime}`,
      route: schoolSelected ? 'School' : 'SelectSchool',
    },
    {
      title: `Status`,
      content: isCompleted ? 'Completed' : 'In Study',
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <UserInformation />
      <View className="items-center flex-1 p-6">
        <View className="w-full px-3 divide-y divide-white bg-header">
          {Educations.map((item) => (
            <TouchableOpacity
              onPress={() => item.route && navigation.navigate(item.route, { ...route.params })}
              className="flex-row items-center justify-between py-3"
              key={item.title}
            >
              <View className="flex-row items-center justify-between flex-1 pr-3">
                <Text className="flex-1 font-semibold text-main">{item.title}</Text>
                {!!schoolSelected && item.title === 'Choose School' && (
                  <Text className="font-semibold text-main">{schoolSelected}</Text>
                )}
                {item.title === 'Grade' && <Text className="pr-6 font-semibold text-main">{`6`}</Text>}
                {item.content && <Text className="font-semibold text-main">{item.content}</Text>}
              </View>
              {item.route && (
                <View>
                  <MaterialIcons name="arrow-forward-ios" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {age >= route.params.maxAge && !isCompleted && route.params.level < 4 && (
          <MyButton
            title="Complete"
            rootClassName="mt-4 rounded-none"
            onPress={() => navigation.navigate('Exams', { ...route.params })}
          />
        )}
      </View>
    </View>
  );
}
