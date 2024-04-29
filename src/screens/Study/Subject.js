import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import UserInformation from '../../components/UserInformation';
import MyButton from '../../components/MyButton';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/AuthStore';
import useQuery from '../../hooks/useQuery';

export default function SubjectScreen({ navigation, route }) {
  const level = route.params.level;
  const profile = useAuthStore((state) => state.profile);
  const subjectSelected = profile ? profile[`subject${level}`] : [];
  const { data } = useQuery('exams-completed', {
    _where: {
      email: profile.email,
    },
    _skip: !profile,
  });

  const isCompleted = profile && profile[`isSchool${level}Completed`];

  return (
    <View className="flex-1 bg-background">
      <UserInformation />
      <View className="flex-1 p-6">
        <ScrollView className="flex-1 ">
          <View className="w-full px-3 divide-y divide-white bg-header">
            {subjectSelected &&
              subjectSelected.map((item) => {
                const target = data.find((i) => i.subject === item.name);
                return (
                  <TouchableOpacity
                    className="flex-row items-center justify-between py-3 "
                    key={item.id}
                    onPress={() =>
                      level === 4 && navigation.navigate('SubjectDetail', { ...route.params, subject: item.name })
                    }
                  >
                    <Text className="flex-1 font-semibold text-white">{item.name}</Text>
                    {target && (
                      <Text className="font-semibold text-main">{target.result > 50 ? 'Passed' : 'Fail'}</Text>
                    )}

                    {level === 4 && (
                      <View>
                        <MaterialIcons name="arrow-forward-ios" size={16} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
          </View>
        </ScrollView>
        {!isCompleted && (
          <MyButton
            title="Setting"
            onPress={() => navigation.navigate('SelectSubject', { ...route.params })}
            rootClassName="mt-4 rounded-none"
          />
        )}
      </View>
    </View>
  );
}
