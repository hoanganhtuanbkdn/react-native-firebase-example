import React, { useState } from 'react';
import { View, Text, ScrollView, Modal, TextInput } from 'react-native';
import UserInformation from '../../components/UserInformation';
import MyButton from '../../components/MyButton';
import { cn } from '../../utils';
import useQuery from '../../hooks/useQuery';
import { createDataByCollection, updateCollection } from '../../firebaseConfig';
import { useAuthStore } from '../../store/AuthStore';

export default function FinanceDashboardScreen({ navigation }) {
  const profile = useAuthStore((state) => state.profile);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [value, setValue] = useState(0);
  const { data: finance, refetch } = useQuery('finance', {
    _where: {
      email: profile.email,
    },
    _skip: !profile.email,
    _sortByCreated: true,
  });

  const handleAddNewTransaction = async () => {
    await createDataByCollection('finance', {
      name,
      value,
      email: profile.email,
    });
    await updateCollection('users', profile.email, {
      balance: Number(profile.balance || 0) + Number(value),
    });
    refetch();
    setName('');
    setValue('');
    setModalVisible(false);
  };

  return (
    <View className="flex-1 bg-background">
      <UserInformation />
      <View className="flex-1 p-4">
        <View className="items-center w-full p-6 bg-header">
          <Text className="font-semibold text-main">Current Balance: {profile ? profile.balance : 0} $</Text>
        </View>
        <ScrollView style={{ flex: 1 }} className="my-3">
          <View className="w-full px-3 divide-y divide-white bg-header">
            <Text className="py-3 text-main">Transactions</Text>
            {finance.map((item, index) => (
              <View className="flex-row items-center justify-between py-3 " key={index}>
                <View className="flex-1">
                  <Text className="font-semibold text-white">
                    {index + 1}. {item.name}
                  </Text>
                </View>
                <View className="w-[60px]">
                  <Text
                    className={cn('font-semibold text-right', Number(item.value) > 0 ? 'text-main' : 'text-red-600')}
                  >
                    {item.value} $
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        <MyButton
          title="New Transaction"
          onPress={() => setModalVisible(true)}
          size="small"
          rootClassName="rounded-none"
        />
      </View>
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
            <Text>New Transaction!</Text>
            <View className="h-[54px] w-full rounded-lg flex-row items-center mt-5 px-2 bg-white border-button border">
              <TextInput className="flex-1 backdrop:h-full" placeholder="Name Transaction" onChangeText={setName} />
            </View>
            <View className="h-[54px] w-full rounded-lg flex-row items-center mt-5 px-2 bg-white border-button border">
              <TextInput
                className="flex-1 h-full"
                placeholder="Value Transaction"
                onChangeText={setValue}
                keyboardType="number-pad"
              />
            </View>
            <MyButton title="Add" rootClassName="w-32 mt-4" size="small" onPress={handleAddNewTransaction} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
