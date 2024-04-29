import React from 'react';
import { SectionList, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import UserInformation from '../../components/UserInformation';
import * as Progress from 'react-native-progress';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

export default function RelationDetailScreen({ route }) {
  const handleAction = () => {
    Alert.alert('Confirm', 'Are you sure you want to ask your mother for money?', [
      {
        text: 'Cancel',
        type: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {},
      },
    ]);
  };
  const Actions = [
    {
      title: 'Ask for money',
      description: 'Ask her for money',
      onPress: handleAction,
    },
    {
      title: 'Conversation',
      description: 'Have a conversation with her',
      onPress: handleAction,
    },
    {
      title: 'Gift',
      description: 'Give her a gift ',
      onPress: handleAction,
    },
    {
      title: 'Compliment',
      description: 'Pay her a compliment',
      onPress: handleAction,
    },
    {
      title: 'Insult',
      description: 'Insult her',
      onPress: handleAction,
    },
    {
      title: 'Movie Theater',
      description: 'Go to the movies with her',
      onPress: handleAction,
    },
    {
      title: 'Spend Time',
      description: 'Spend time with her',
      onPress: handleAction,
    },
  ];
  return (
    <View className="flex-1 bg-background">
      <UserInformation />
      <ScrollView className="flex-1">
        {route.params && route.params.item && (
          <TouchableOpacity className="bg-header px-6 py-3 flex-row justify-between items-center gap-x-6">
            <View className="flex-1">
              <Text className="text-main font-semibold text-xs">{route.params.item.name}</Text>
              <View className="mt-3 flex-row items-center justify-between">
                <Text className="text-main font-semibold text-xs">Relation</Text>
                <Progress.Bar
                  progress={route.params.item.level / 100}
                  width={200}
                  borderRadius={0}
                  color={route.params.item.level > 40 ? 'green' : '#FF6050'}
                />
              </View>
            </View>
            <TouchableOpacity onPress={handleAction}>
              <Feather name="more-horizontal" size={16} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        <View className="bg-main h-[30px] flex items-center justify-center">
          <Text className="text-header text-xs font-semibold">Activities</Text>
        </View>
        <View className="divide-y divide-[#EEEEEE]">
          {Actions.map((item) => (
            <TouchableOpacity
              key={item.title}
              className="bg-header px-6 py-3 flex-row justify-between items-center gap-x-6"
            >
              <View className="flex-1">
                <Text className="text-main font-semibold text-xs">{item.title}</Text>
                <Text className="text-main font-semibold text-[9px] mt-1">{item.description}</Text>
              </View>
              <TouchableOpacity onPress={item.onPress}>
                <Feather name="more-horizontal" size={16} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
