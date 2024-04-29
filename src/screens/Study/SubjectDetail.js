import React from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import MyButton from '../../components/MyButton';
import useQuery from '../../hooks/useQuery';
import { useAuthStore } from '../../store/AuthStore';

export default function SubjectDetailScreen({ navigation, route }) {
  const profile = useAuthStore((state) => state.profile);
  const { data, loading } = useQuery('exams-completed', {
    _where: {
      email: profile.email,
      subject: route.params.subject,
    },
  });

  const isCompleted = data && data[0];
  return (
    <View className="flex-1 px-6 py-3 bg-background">
      <ScrollView style={{ flex: 1 }} className="my-3">
        <View className="p-4 mb-4 bg-header">
          <Text className="font-semibold text-center text-white">{`Subject: ${route.params.subject}`}</Text>

          {loading ? (
            <View className="items-center justify-center">
              <Text className="font-semibold text-center text-white">Loading</Text>
            </View>
          ) : (
            <>
              <Text className="mt-3 font-semibold text-center text-white">
                Status: {isCompleted ? (data[0].result > 50 ? 'Pass' : 'Fail') : 'In Study'}
              </Text>
            </>
          )}
        </View>

        {!isCompleted && !loading && (
          <MyButton
            title="Start Exam"
            size="small"
            rootClassName="rounded-none"
            onPress={() => navigation.navigate('SubjectExams', { ...route.params })}
          />
        )}
      </ScrollView>
    </View>
  );
}
