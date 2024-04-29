import React, { memo, useEffect, useRef, useState } from 'react';
import { Text, View, ScrollView, Modal, TouchableOpacity } from 'react-native';
import UserInformation from '../../components/UserInformation';
import * as Progress from 'react-native-progress';
import useQuery from '../../hooks/useQuery';
import MyButton from '../../components/MyButton';
import { useUserStore } from '../../store/UserStore';
import { cn, formatNumber } from '../../utils';
import { useIsFocused } from '@react-navigation/native';
import { createDataByCollection, updateCollection } from '../../firebaseConfig';
import moment from 'moment';
import { useAuthStore } from '../../store/AuthStore';
import { isArray } from 'ramda-adjunct';

export default function StatusScreen() {
  const { age, setLastLoggedIn, lastLoggedInAt, setAge } = useUserStore((state) => ({
    age: state.age,
    setLastLoggedIn: state.setLastLoggedIn,
    lastLoggedInAt: state.lastLoggedInAt,
    setAge: state.setAge,
  }));
  const profile = useAuthStore((state) => state.profile);
  const { data: events = [] } = useQuery('events');
  const { data: history = [], refetch } = useQuery('events-history', {
    _where: {
      email: profile.email,
    },
    _orderBy: 'age',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [eventShowing, setEventShowing] = useState({});
  const prevAge = useRef(age);
  const isFocused = useIsFocused();

  const handleShowEvent = async () => {
    const targetEvent = events.find((item) => item.age === age);
    if (!targetEvent) return;
    setEventShowing(targetEvent);
    if (isFocused) {
      setModalVisible(true);
    }

    prevAge.current = age;
    await createDataByCollection('events-history', {
      ...targetEvent,
      eventId: targetEvent.id,
      email: profile.email,
    });

    targetEvent.actions.map(async (item) => {
      const value = item.split(';')[0];
      const type = item.split(';')[1].trim();
      if (Number(type) === 1) {
        // health
        await updateCollection('users', profile.email, {
          health: formatNumber(Number(profile.health || 0) + Number(value)),
        });
      }
      if (Number(type) === 2) {
        // hapiness
        await updateCollection('users', profile.email, {
          hapiness: formatNumber(Number(profile.hapiness || 0) + Number(value)),
        });
      }
      if (Number(type) === 3) {
        // smart
        await updateCollection('users', profile.email, {
          smart: formatNumber(Number(profile.smart || 0) + Number(value)),
        });
      }
      if (Number(type) === 4) {
        // skill
        await updateCollection('users', profile.email, {
          skill: formatNumber(Number(profile.skill || 0) + Number(value)),
        });
      }
      if (Number(type) === 5) {
        // money
        await createDataByCollection('finance', {
          name: targetEvent.content || targetEvent.contents,
          value: value,
          email: profile.email,
        });
        await updateCollection('users', profile.email, {
          balance: Number(profile.balance || 0) + Number(value),
        });
      }
    });
    refetch();
  };

  const handleSkipAge = () => {
    const newAge = age + 1;
    setAge(newAge);
  };
  useEffect(() => {
    if (prevAge.current < age) {
      handleShowEvent();
    }
  }, [age]);

  const handleDailyLogin = async () => {
    const today = moment().format('YYYY.MM.DD');
    if (lastLoggedInAt !== today) {
      await createDataByCollection('finance', {
        name: 'Daily login',
        value: 100,
        email: profile.email,
      });
      await updateCollection('users', profile.email, {
        balance: Number(profile.balance || 0) + 100,
      });

      setLastLoggedIn(today);
    }
  };
  useEffect(() => {
    handleDailyLogin();
  }, []);

  return (
    <View className="flex-1 bg-background">
      <UserInformation />
      <View className="flex-1 p-6">
        <View className="flex-row items-center justify-center space-x-4">
          <Text className="text-white w-[70px] ">Health</Text>
          <Progress.Bar
            progress={profile.health / 100}
            borderRadius={0}
            height={10}
            color={profile.health >= 80 ? 'green' : profile.health > 30 ? '#FFD700' : '#FF3050'}
          />
          <Text className="text-white w-[70px] ">{profile.health} %</Text>
        </View>
        <View className="flex-row items-center justify-center mt-2 space-x-4">
          <Text className="text-white w-[70px] ">Happiness</Text>
          <Progress.Bar
            progress={profile.hapiness / 100}
            borderRadius={0}
            height={10}
            color={profile.hapiness >= 80 ? 'green' : profile.hapiness > 30 ? '#FFD700' : '#FF3050'}
          />
          <Text className="text-white w-[70px] ">{profile.hapiness} %</Text>
        </View>
        <View className="flex-row items-center justify-center mt-2 space-x-4">
          <Text className="text-white w-[70px] ">Smart</Text>
          <Progress.Bar
            progress={profile.smart / 100}
            borderRadius={0}
            height={10}
            color={profile.smart >= 80 ? 'green' : profile.smart > 30 ? '#FFD700' : '#FF3050'}
          />
          <Text className="text-white w-[70px] ">{profile.smart} %</Text>
        </View>
        <View className="flex-row items-center justify-center mt-2 space-x-4">
          <Text className="text-white w-[70px] ">Life Skill</Text>
          <Progress.Bar
            progress={profile.skill / 100}
            borderRadius={0}
            height={10}
            color={profile.skill >= 80 ? 'green' : profile.skill > 30 ? '#FFD700' : '#FF3050'}
          />
          <Text className="text-white w-[70px] ">{profile.skill} %</Text>
        </View>
        <View className="flex-1 p-7 mt-3 bg-header">
          <ScrollView className="flex-col flex-1 ">
            {history.map((item, index) => (
              <View key={item.id} className="mb-3">
                <Text className="text-white">
                  - Age {item.age}: {item.content || item.contents}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <MyButton title="Skip current age " rootClassName="mt-4" onPress={handleSkipAge} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View className="items-center justify-center flex-1 bg-black/30">
            <View className="items-center p-5 mx-8 bg-white rounded-xl">
              <Text className="text-[#D9ED92] text-2xl uppercase font-bold">{eventShowing.type}</Text>
              <Text className="text-[#99D98C] text-xl mb-2 font-semibold">{eventShowing.title}</Text>
              <Text className="text-[#99D98C] mb-4 text-center">{eventShowing.contents || eventShowing.content}</Text>
              <View className="flex-row items-center justify-between w-full">
                {eventShowing &&
                  isArray(eventShowing.actions) &&
                  eventShowing.actions.map((action, index) => {
                    const value = action.split(';') && action.split(';')[0];
                    const type = (action.split(';') && action.split(';')[1]) || '';
                    return (
                      <View className="flex-row items-center" key={eventShowing.type + '-' + index}>
                        <Text className={cn('font-bold', Number(value) > 0 ? 'text-main' : 'text-red-500')}>
                          {value && value.trim()}
                        </Text>
                        <Text className="ml-2 text-xs font-bold ">
                          {Number(type.trim()) === 1
                            ? 'Health'
                            : Number(type.trim()) === 2
                            ? 'Happiness'
                            : Number(type.trim()) === 3
                            ? 'Smart'
                            : Number(type.trim()) === 4
                            ? 'Skill'
                            : 'Money'}
                        </Text>
                      </View>
                    );
                  })}
              </View>
              <TouchableOpacity
                className="py-3 mt-5 rounded-lg px-7 bg-header"
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text className="text-white">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
