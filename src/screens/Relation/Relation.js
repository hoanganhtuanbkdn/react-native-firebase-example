import React from 'react';
import { SectionList, View, Text, TouchableOpacity } from 'react-native';
import UserInformation from '../../components/UserInformation';
import * as Progress from 'react-native-progress';
import { MaterialIcons } from '@expo/vector-icons';
import useQuery from '../../hooks/useQuery';
import { randomNumber } from '../../utils';

export default function RelationScreen({ navigation }) {
  const { data: friends } = useQuery('friends', {});

  console.log(444, friends);
  const Relations = [
    {
      title: 'Parents',
      data: [
        {
          name: 'Anna Bell (Mother)',
          level: 80,
        },
        {
          name: 'Becky Chen (Father)',
          level: 70,
        },
      ],
    },
    {
      title: 'Siblings',
      data: [
        {
          name: 'Dalisa Amal (Stepsister)',
          level: 60,
        },
        {
          name: 'Mark Agola (Half Brother)',
          level: 30,
        },
        {
          name: 'Sweedy Crep ( Half Sister)',
          level: 50,
        },
      ],
    },
    {
      title: 'Friends',
      data: friends.map((item) => ({ ...item, level: randomNumber(99) })),
    },
  ];
  return (
    <View className="flex-1 bg-background">
      <UserInformation />
      <View className="flex-1">
        <SectionList
          sections={Relations}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('RelationDetail', { item })}
              className="flex-row items-center justify-between px-6 py-3 bg-header gap-x-6"
            >
              <View className="flex-1">
                <Text className="text-xs font-semibold text-main">{item.name}</Text>
                <View className="flex-row items-center justify-between mt-3">
                  <Text className="text-xs font-semibold text-main">Relation</Text>
                  <Progress.Bar
                    progress={item.level / 100}
                    width={200}
                    borderRadius={0}
                    color={item.level > 40 ? 'green' : '#FF6050'}
                  />
                </View>
              </View>
              <View>
                <MaterialIcons name="arrow-forward-ios" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View className="bg-main h-[30px] flex items-center justify-center">
              <Text className="text-xs font-semibold text-header">{title}</Text>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View className="px-6 bg-header">
              <View className="bg-white h-[1px] w-full "></View>
            </View>
          )}
        />
      </View>
    </View>
  );
}
