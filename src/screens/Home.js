import * as React from 'react';
import { View, Text } from 'react-native';
import Button from '../components/MyButton';
import { useAuthStore } from '../store/AuthStore';
import { useUserStore } from '../store/UserStore';

function HomeScreen({ navigation }) {
  const { username, logout } = useAuthStore((state) => state);
  const reset = useUserStore((state) => state.reset);
  const handleLogout = () => {
    logout();
    reset();
  };
  return (
    <View className="items-center justify-center flex-1 p-10 bg-background">
      <View className="absolute text-center top-10">
        <Text className="text-main">Welcome,{username}</Text>
      </View>
      <Text className="text-[40px] text-main font-bold">I AM</Text>
      <Text className="text-[40px] text-main font-bold mt-2">A DEVELOPER</Text>
      <Button title="Start" rootClassName="mt-4" onPress={() => navigation.navigate('Main')} />
      <Button title="Options" rootClassName="mt-4" />
      <Button title="Quit" type="danger" onPress={handleLogout} rootClassName="mt-4" />
    </View>
  );
}

export default HomeScreen;
