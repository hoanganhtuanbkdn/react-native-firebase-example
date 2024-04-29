import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/Login';
import RegisterScreen from './src/screens/Register';
import ForgotPasswordScreen from './src/screens/ForgotPassword';
import HomeScreen from './src/screens/Home';

import Toast from 'react-native-toast-message';
import { useAuthStore } from './src/store/AuthStore';

const Stack = createNativeStackNavigator();

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EducationScreen from './src/screens/Study/Education';
import EducationDetailScreen from './src/screens/Study/EducationDetail';
import { Text } from 'react-native';
import SelectSchoolScreen from './src/screens/Study/SelectSchool';
import SelectSubjectScreen from './src/screens/Study/SelectSubject';
import SchoolScreen from './src/screens/Study/School';
import ExamsScreen from './src/screens/Study/Exams';
import FinanceDashboardScreen from './src/screens/Finance/Dashboard';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Timer from './src/components/Timer';
import RelationScreen from './src/screens/Relation/Relation';
import { FontAwesome5 } from '@expo/vector-icons';
import RelationDetailScreen from './src/screens/Relation/RelationDetail';
import CareerScreen from './src/screens/Career/Career';
import { MaterialIcons } from '@expo/vector-icons';
import CareerDetailScreen from './src/screens/Career/CareerDetail';
import SubjectScreen from './src/screens/Study/Subject';
import SubjectExamsScreen from './src/screens/Study/SubjectExams';
import SubjectDetailScreen from './src/screens/Study/SubjectDetail';
import StatusScreen from './src/screens/Status/Status';

const Tab = createBottomTabNavigator();

const headerStyle = {
  headerStyle: {
    backgroundColor: '#104271',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'semibold',
  },
};
function MainTabs() {
  return (
    <Tab.Navigator initialRouteName="Status" screenOptions={{ ...headerStyle }}>
      <Tab.Screen
        name="Status"
        component={StatusScreen}
        options={{
          title: 'I am a developer ',
          tabBarIcon: ({ color, size }) => <Ionicons name="school-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Education"
        component={EducationScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="school-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Financial"
        component={FinanceDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="money" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Friends"
        component={RelationScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="user-friends" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Career"
        component={CareerScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="work-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  const isLogged = useAuthStore((state) => state.isLogged);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          ...headerStyle,
          headerBackTitleVisible: false,
        }}
      >
        {isLogged ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="EducationDetail" component={EducationDetailScreen} />
            <Stack.Screen name="SelectSchool" component={SelectSchoolScreen} />
            <Stack.Screen name="SelectSubject" component={SelectSubjectScreen} />
            <Stack.Screen name="Subject" component={SubjectScreen} />
            <Stack.Screen name="School" component={SchoolScreen} />
            <Stack.Screen name="Exams" component={ExamsScreen} />
            <Stack.Screen name="SubjectDetail" options={{ title: 'Subject Detail' }} component={SubjectDetailScreen} />
            <Stack.Screen name="SubjectExams" options={{ title: 'Subject Exams' }} component={SubjectExamsScreen} />
            <Stack.Screen name="RelationDetail" component={RelationDetailScreen} />
            <Stack.Screen name="CareerDetail" component={CareerDetailScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
      <Toast />
      <Timer />
    </NavigationContainer>
  );
}

export default App;
