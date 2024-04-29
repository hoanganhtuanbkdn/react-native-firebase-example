import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import UserInformation from '../../components/UserInformation';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUserStore } from '../../store/UserStore';
import { MaterialIcons } from '@expo/vector-icons';
import useQuery from '../../hooks/useQuery';
import { updateCollection } from '../../firebaseConfig';
import { useAuthStore } from '../../store/AuthStore';

export default function CareerScreen({ navigation }) {
  const age = useUserStore((state) => state.age);
  const profile = useAuthStore((state) => state.profile);

  const { data: careers } = useQuery('careers');

  const handleEducationDetail = (item) => {
    if (age < 18) {
      Alert.alert('Program Locking', 'You are not old enough to study this program.', [
        { text: 'OK', onPress: () => {} },
      ]);
    } else {
      navigation.navigate('CareerDetail', { ...item });
    }
  };
  const handleAskDayOff = () => {
    Alert.alert('Success', 'Your request for a day off was accepted', [
      {
        text: 'OK',
        onPress: () => {},
      },
    ]);
  };
  const handleAskPayRise = () => {
    Alert.alert('Success', 'Your request for a payrise was accepted', [
      {
        text: 'OK',
        onPress: () => {},
      },
    ]);
  };
  const handleQuitJob = () => {
    Alert.alert('Success', 'You have quitted your job as a ' + profile.job.name, [
      { text: 'Cancel', type: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          await updateCollection('users', profile.email, {
            job: null,
          });
          refetch();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <UserInformation />
      {profile.job ? (
        <View className="items-center flex-1 p-6">
          <View className="items-center w-full p-3 bg-header">
            <Text className="mb-1 text-xs font-semibold text-white">Current Job</Text>
            <Text className="font-semibold text-main">{profile.job.name}</Text>
          </View>
          <View className="w-full p-4 mt-3 space-y-3 bg-header">
            {profile.job.description.map((content, index) => (
              <Text key={index} className="font-semibold text-white ">
                {content}
              </Text>
            ))}
          </View>
          <View className="flex-row items-center w-full mt-6 space-x-6">
            <TouchableOpacity className="items-center justify-center flex-1 px-4 py-3 bg-header ">
              <Text className="font-semibold text-white">Work</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAskDayOff}
              className="items-center justify-center flex-1 px-4 py-3 bg-header "
            >
              <Text className="font-semibold text-blue-500">Ask for day off</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center w-full mt-6 space-x-6">
            <TouchableOpacity
              onPress={handleAskPayRise}
              className="items-center justify-center flex-1 px-4 py-3 bg-header "
            >
              <Text className="font-semibold text-main">Ask for pay rise</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleQuitJob}
              className="items-center justify-center flex-1 px-4 py-3 bg-header"
            >
              <Text className="font-semibold text-red-500">Quit Job</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="items-center flex-1 p-6">
          <View className="items-center w-full p-6 bg-header">
            <Text className="font-semibold text-main">Career paths</Text>
          </View>

          <View className="w-full">
            {careers.map((item) => (
              <TouchableOpacity
                onPress={() => handleEducationDetail(item)}
                className="flex-row items-center justify-between mt-3 px-3 py-3 bg-header"
                key={item.name}
              >
                <Text className="flex-1 font-semibold text-main">{item.name}</Text>
                <View className="flex-row items-center justify-between flex-1">
                  <View className="flex-row items-center justify-between flex-1">
                    <View className="flex items-center justify-center flex-1 ">
                      {/* {item.minAge > age && ( */}
                      <View className="flex-row items-center gap-x-2">
                        <Ionicons name="lock-closed" size={20} color="#fff" />
                        <Text className="text-xs w-[80px] text-center text-red-600">Requirements not match</Text>
                      </View>
                      {/* )} */}
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
      )}
    </View>
  );
}
