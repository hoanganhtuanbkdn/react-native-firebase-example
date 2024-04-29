import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import UserInformation from '../../components/UserInformation';
import useQuery from '../../hooks/useQuery';
import { useAuthStore } from '../../store/AuthStore';
import { updateCollection } from '../../firebaseConfig';
import moment from 'moment';

export default function SelectSchoolScreen({ navigation, route }) {
  const profile = useAuthStore((state) => state.profile);
  const schoolSelected = profile[`school${route.params.level}Name`];
  const { data: schools } = useQuery('schools', {
    _where: {
      level: route.params.level,
    },
  });

  useEffect(() => {
    navigation.setOptions({ title: route.params.title });
  }, []);

  const handleSelectSchool = (item) => {
    Alert.alert('Selecting ' + item.name, 'Do you want to choose this school!', [
      {
        text: 'Cancel',
        type: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          updateCollection('users', profile.email, {
            [`school${route.params.level}Name`]: item.name,
            [`school${route.params.level}Start`]: moment().format('DD/MM/YYYY'),
          });
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <UserInformation />
      <View className="items-center flex-1 p-6">
        <View className="w-full space-y-3">
          {schoolSelected ? (
            <View className="p-6 bg-header">
              <Text className="font-semibold text-center text-main"> Welcome to Our School!</Text>
              <Text className="mt-3  text-main">
                {`Dear ${profile.username}, \nWelcome to our school! We're thrilled to have you with us and look forward to an exciting journey ahead.\nBest regards,\n[${schoolSelected}]`}
              </Text>
            </View>
          ) : (
            schools.map((item) => (
              <TouchableOpacity
                onPress={() => handleSelectSchool(item)}
                className="flex-row items-center justify-between p-3 bg-header"
                key={item.id}
              >
                <View className="flex-1 space-y-3">
                  <Text className="font-semibold text-main">{item.name}</Text>
                  <Text className="font-semibold text-main">Distance: 500m</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-main">Quality: {item.quality}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </View>
  );
}
