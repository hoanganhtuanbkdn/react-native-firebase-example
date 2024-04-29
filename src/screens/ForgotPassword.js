import * as React from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { sendResetPasswordEmail } from '../firebaseConfig';
import { Formik } from 'formik';
import MyInput from '../components/MyInput';
import MyButton from '../components/MyButton';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

const validationSchema = Yup.object().shape({
  email: Yup.string().min(2, 'Too Short!').email('Invalid email').max(50, 'Too Long!').required('Required'),
});

function ForgotPasswordScreen({ navigation }) {
  const onNavigateLogin = () => {
    navigation.navigate('Login');
  };

  const onForgotPassword = async (values, actions) => {
    await sendResetPasswordEmail(values.email)
      .then(() => {
        navigation.navigate('Login');
        Toast.show({
          type: 'success',
          text1: 'Password reset email sent',
          text2: `We've sent a password reset email to your email address. Please check your inbox to proceed with the password reset process. 👋`,
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
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-background items-center justify-center p-10">
      <View className="flex-col w-full items-center justify-center bg-white rounded-xl p-4">
        <Text className="text-2xl font-semibold text-button">Forgot Password!</Text>
        <Text className="text-button mt-3 text-center">
          Enter your email and we will send you an OTP code to reset your password
        </Text>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            onForgotPassword(values, actions);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, errors, isSubmitting }) => (
            <>
              <View className="h-[48px] w-full rounded-lg flex-row items-center mt-5 px-2 bg-white border-button border">
                <View className="w-7">
                  <Ionicons name="mail-sharp" size={28} color="#B5E48C" />
                </View>
                <MyInput
                  className="flex-1 ml-2 h-full"
                  placeholder="Enter your email"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
              </View>
              <Text className="text-red-500 my-2 text-right w-full">{errors.email}</Text>
              <MyButton
                title="Submit"
                loading={isSubmitting}
                onPress={handleSubmit}
                className="bg-main w-full rounded-lg h-[54px] flex items-center mt-5 justify-center"
              />
              <TouchableOpacity className=" mt-5 flex-row items-center " onPress={onNavigateLogin}>
                <Ionicons name="arrow-back" size={16} color="#184E77" />

                <Text className="text-button"> Back to Login </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}

export default ForgotPasswordScreen;
