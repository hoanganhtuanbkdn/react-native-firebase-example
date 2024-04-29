import * as React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { Formik } from 'formik';

import * as Yup from 'yup';
import { useAuthStore } from '../store/AuthStore';
import { createUser, registerWithEmailAndPassword } from '../firebaseConfig';
import MyInput from '../components/MyInput';
import { cn, randomNumber } from '../utils';
const avatar = randomNumber(5);
const personality = randomNumber(3);
const SignInSchema = Yup.object().shape({
  username: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  email: Yup.string().min(2, 'Too Short!').email('Invalid email').max(50, 'Too Long!').required('Required'),
  password: Yup.string().min(5, 'Too Short!').max(50, 'Too Long!').required('Required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Must match "password" field value'),
});
function RegisterScreen({ navigation }) {
  const [isChecked, setChecked] = React.useState(false);
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  const onNavigateSignIn = () => {
    navigation.navigate('Login');
  };

  const onNavigateForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignUp = async (values, actions) => {
    await registerWithEmailAndPassword(values.email, values.password)
      .then(async (userCredential) => {
        const newProfile = {
          ...values,
          avatar,
          personality,
          health: 100,
          hapiness: 100,
          smart: 100,
          skill: 100,
          balance: 0,
        };
        await createUser(newProfile);
        loginSuccess(newProfile);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'You created your account👋',
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
      <Text className="text-2xl font-semibold text-white">GET STARTED!</Text>
      <Text className="mt-3 text-white">Create a new account</Text>
      <Formik
        initialValues={{ username: '' }}
        validationSchema={SignInSchema}
        onSubmit={(values, actions) => {
          onSignUp(values, actions);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting }) => (
          <>
            <View className="h-[54px] w-full rounded-lg flex-row items-center mt-5 px-2 bg-white">
              <View className="w-7">
                <Ionicons name="person-circle-outline" size={28} color="#B5E48C" />
              </View>
              <MyInput
                className="flex-1 h-full ml-2"
                placeholder="Enter username"
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
              />
            </View>
            <Text className="w-full mt-2 text-right text-red-500">{errors.username}</Text>

            <View className="h-[54px] w-full rounded-lg flex-row items-center mt-5 px-2 bg-white">
              <View className="w-7">
                <Ionicons name="mail-sharp" size={28} color="#B5E48C" />
              </View>
              <MyInput
                className="flex-1 h-full ml-2"
                placeholder="Enter email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
            </View>
            <Text className="w-full mt-2 text-right text-red-500">{errors.email}</Text>

            <View className="h-[54px] w-full rounded-lg flex-row items-center mt-5 px-2 bg-white">
              <View className="w-7">
                <Ionicons name="lock-closed" size={26} color="#B5E48C" />
              </View>
              <MyInput
                className="flex-1 h-full ml-2"
                placeholder="Enter password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
              />
            </View>
            <Text className="w-full mt-2 text-right text-red-500">{errors.password}</Text>

            <View className="h-[54px] w-full rounded-lg flex-row items-center mt-5 px-2 bg-white">
              <View className="w-7">
                <Ionicons name="lock-closed" size={26} color="#B5E48C" />
              </View>
              <MyInput
                className="flex-1 h-full ml-2"
                placeholder="Confirm password"
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                secureTextEntry
              />
            </View>
            <Text className="w-full mt-2 text-right text-red-500">{errors.confirmPassword}</Text>

            <View className="flex-row items-center justify-between w-full my-5">
              <View className="flex-row items-center gap-3">
                <Checkbox
                  value={isChecked}
                  onValueChange={setChecked}
                  className="bg-[#D9D9D9] border-[#D9D9D9]"
                  color={isChecked ? '#B5E48C' : undefined}
                />
                <TouchableOpacity className="border-b border-main">
                  <Text className="font-semibold text-main">Terms and conditions</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isChecked || isSubmitting}
              className={cn(
                ' w-full rounded-lg h-[54px] flex items-center justify-center',
                isChecked ? 'bg-main' : 'bg-gray-300',
              )}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-lg font-semibold text-button">Sign Up</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </Formik>
      <View className="flex-row items-center mt-3 ">
        <Text className="text-main ">You have an account? Sign in </Text>
        <View className="border-b border-main">
          <Text className="text-main" onPress={onNavigateSignIn}>
            here!
          </Text>
        </View>
      </View>
      <TouchableOpacity className="mt-3 border-b border-main" onPress={onNavigateForgotPassword}>
        <Text className="text-main">Forgot Password</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;
