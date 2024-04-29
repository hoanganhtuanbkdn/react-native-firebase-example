import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import UserInformation from '../../components/UserInformation';
import Checkbox from 'expo-checkbox';
import useQuery from '../../hooks/useQuery';
import { updateCollection } from '../../firebaseConfig';
import { useAuthStore } from '../../store/AuthStore';
import { useUserStore } from '../../store/UserStore';
import { cn } from '../../utils';

export default function SelectSubjectScreen({ navigation, route }) {
  const level = route.params.level;

  const [subjectSelected, setSubjectSelected] = useState([]);
  const profile = useAuthStore((state) => state.profile);
  // const _subjectSelected = profile ? profile[`subject${level}`] : [];
  const { data: examsCompleted } = useQuery('exams-completed', {
    _where: {
      email: profile.email,
    },
    _skip: !profile,
  });
  const age = useUserStore((state) => state.age);

  const { data: subjects } = useQuery('subjects', {
    _where: {
      level: route.params.level,
    },
    ...(route.params.level === 4 ? { _orderBy: 'year' } : {}),
  });

  console.log(111, subjects);
  const handleSelectSchool = (item, isPass) => {
    if (!isPass) {
      return Alert.alert('Require: ' + item.require);
    }
    const index = subjectSelected.findIndex((i) => i.name === item.name);
    let newSubject = [];
    if (index !== -1) {
      newSubject = subjectSelected.filter((i) => i.name !== item.name);
      setSubjectSelected(newSubject);
    } else {
      newSubject = [item, ...subjectSelected];
      setSubjectSelected(newSubject);
    }

    updateCollection('users', profile.email, {
      [`subject${route.params.level}`]: newSubject,
    });
  };

  useEffect(() => {
    const _subjectSelected =
      profile && profile[`subject${route.params.level}`] ? profile[`subject${route.params.level}`] : [];
    setSubjectSelected(_subjectSelected);
  }, [profile]);

  return (
    <View className="flex-1 bg-background">
      <UserInformation />
      <View className="flex-1 p-6">
        <ScrollView className="flex-1">
          <View className="w-full px-3 divide-y divide-white bg-header">
            {subjects.map((item, index) => {
              const isChecked = subjectSelected.find((item2) => item2.name === item.name);
              if (item.year !== 1 && age === 18) return null;
              const target = examsCompleted.find((i) => i.subject === item.name);
              const subjectRequire = item.require && examsCompleted.find((i) => i.subject === item.require);
              const isPass = !item.require || (subjectRequire && subjectRequire.result > 50);
              return (
                <View className="flex-row items-center justify-between py-3 " key={item.id}>
                  <View className="flex-row items-center ">
                    <Checkbox
                      value={isChecked}
                      onValueChange={() => handleSelectSchool(item, isPass)}
                      className="bg-[#D9D9D9] border-[#D9D9D9]"
                      color={isChecked ? '#B5E48C' : undefined}
                    />
                    <View className="pl-3">
                      <Text
                        className={cn(
                          'font-semibold ',
                          subjectRequire && subjectRequire.result > 50 ? 'text-main' : 'text-white',
                        )}
                      >
                        {item.name}
                      </Text>
                      {item.require && (
                        <Text className="text-xs font-semibold text-white mt-1">Require: {item.require}</Text>
                      )}
                    </View>
                  </View>
                  {item.year ? <Text className="pl-3 font-semibold text-main">Year: {item.year}</Text> : <View></View>}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
