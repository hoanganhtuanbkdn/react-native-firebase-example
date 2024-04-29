import * as React from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import Button from '../components/MyButton';
import { useAuthStore } from '../store/AuthStore';
import { Formik } from 'formik';

import * as Yup from 'yup';
import { getUserByEmail, loginWithEmailAndPassword } from '../firebaseConfig';
import MyInput from '../components/MyInput';
import { cn } from '../utils';

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  password: Yup.string().min(5, 'Too Short!').max(50, 'Too Long!').required('Required'),
});

function LoginScreen({ navigation }) {
  const loginSuccess = useAuthStore((state) => state.loginSuccess);
  const [isChecked, setChecked] = React.useState(false);

  const onNavigateSignUp = () => {
    navigation.navigate('Register');
  };

  const onNavigateForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const onLogin = async (values, actions) => {
    await loginWithEmailAndPassword(values.email, values.password)
      .then(async (userCredential) => {
        const user = await getUserByEmail(values.email);
        loginSuccess({ ...user, email: values.email });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'You login successfully👋',
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert('Error', errorMessage, [
          {
            text: 'Try again',
          },
        ]);
      });
    actions.setSubmitting(false);
  };
  return (
    <KeyboardAvoidingView behavior="padding" className="flex-col items-center justify-center flex-1 p-10 bg-background">
      <Text className="text-2xl font-semibold text-white">WELCOME BACK!</Text>
      <Text className="mt-3 text-white">Enter your details</Text>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={SignInSchema}
        onSubmit={(values, actions) => {
          onLogin(values, actions);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, isSubmitting, errors }) => (
          <>
            <View className="h-[54px] w-full rounded-lg flex-row items-center mt-5 px-2 bg-white">
              <View className="w-7">
                <Ionicons name="person-circle-outline" size={28} color="#B5E48C" />
              </View>
              <MyInput
                className="flex-1 h-full ml-2"
                placeholder="Your Email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                inputMode="email"
              />
            </View>
            <Text className="w-full mt-2 text-right text-red-500">{errors.email}</Text>

            <View className="h-[54px] w-full rounded-lg flex-row items-center mt-5 px-2 bg-white">
              <View className="w-7">
                <Ionicons name="lock-closed" size={26} color="#B5E48C" />
              </View>
              <MyInput
                className="flex-1 h-full ml-2"
                placeholder="Your Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
              />
            </View>
            <Text className="w-full mt-2 text-right text-red-500">{errors.password}</Text>
            <View className="flex-row items-center justify-between w-full my-5">
              <View className="flex-row items-center gap-3">
                <Checkbox
                  value={isChecked}
                  onValueChange={setChecked}
                  className="bg-[#D9D9D9] border-[#D9D9D9]"
                  color={isChecked ? '#B5E48C' : undefined}
                />
                <Text className="font-semibold text-main">Remember me</Text>
              </View>
              <TouchableOpacity className="border-b  border-main" onPress={onNavigateForgotPassword}>
                <Text className="text-main">Forgot Password</Text>
              </TouchableOpacity>
            </View>
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              onPress={handleSubmit}
              title="Login"
              rootClassName={cn(' w-full rounded-lg h-[54px] flex items-center justify-center bg-main')}
            />
          </>
        )}
      </Formik>

      <View className="flex-row items-center mt-3 ">
        <Text className="text-main ">Don’t have an account? Sign up </Text>
        <View className="border-b border-main">
          <Text className="text-main" onPress={onNavigateSignUp}>
            here!
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
