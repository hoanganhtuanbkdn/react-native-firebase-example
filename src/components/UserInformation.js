import React, { memo } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useUserStore } from '../store/UserStore';
import { useAuthStore } from '../store/AuthStore';
import { MinuteToYear } from './Timer';
import { randomNumber } from '../utils';

const Avatars = [
  require('../images/avatar1.png'),
  require('../images/avatar2.png'),
  require('../images/avatar3.png'),
  require('../images/avatar4.png'),
  require('../images/avatar5.png'),
  require('../images/avatar6.png'),
];
const n = randomNumber(4);

const Personality = ['gentle', 'stubborn', '​​mischievous', 'introverted'];
function UserInformation() {
  const { age, seconds } = useUserStore((state) => state);
  const profile = useAuthStore((state) => state.profile);

  return (
    <View>
      <View className="flex flex-row p-3 bg-background2">
        <View className="relative flex items-center justify-center w-16 h-16 overflow-hidden">
          <ImageBackground
            source={Avatars[profile.avatar] || Avatars[1]}
            className="z-10 w-12 h-12 bg-white rounded-full"
          ></ImageBackground>
          <View className="absolute">
            <CircularProgress
              value={seconds}
              radius={32}
              duration={100}
              progressValueColor={'#ecf0f1'}
              maxValue={MinuteToYear * 60}
            />
          </View>
        </View>
        <View className="flex-row items-center justify-between flex-1 px-3">
          <View className="flex-1 space-y-4">
            <Text className="font-semibold text-main">{profile.username}</Text>
            <Text className="font-semibold text-main">{Personality[profile.personality || n] || 'gentle'}</Text>
          </View>
          <View className="items-end flex-1 space-y-4">
            <Text className="font-semibold text-main">Growing up</Text>
            <Text className="font-semibold text-main">Age: {age} years</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default memo(UserInformation);
