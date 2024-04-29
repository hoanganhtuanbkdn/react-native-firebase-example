import React, { useState, useEffect, memo, useCallback } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';
import MyButton from '../../components/MyButton';
import useQuery from '../../hooks/useQuery';
import { cn } from '../../utils';
import { createDataByCollection } from '../../firebaseConfig';
import { useAuthStore } from '../../store/AuthStore';

export default function SubjectExamsScreen({ navigation, route }) {
  const [isSubmit, setIsSubmit] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const profile = useAuthStore((state) => state.profile);
  const { data: exams } = useQuery('exams', {
    _where: {
      level: route.params.level,
      subject: route.params.subject,
    },
  });
  const { data, refetch } = useQuery('exams-completed', {
    _where: {
      email: profile.email,
      subject: route.params.subject,
    },
    _skip: !profile,
  });

  const onSelectAnswer = useCallback(
    (item, answer) => {
      const answersUpdated = userAnswers.map((item2) =>
        item2.question === item.question ? { ...item2, answer } : item2,
      );
      setUserAnswers(answersUpdated);
    },
    [userAnswers],
  );

  console.log(222, data);
  const correctCount = userAnswers.filter((item) => item.answer === item.correct);
  const isPassed = (correctCount.length / userAnswers.length) * 100 > 50;
  const isCompleted = data && data[0] && data[0].result > 50;
  const handleSubmit = () => {
    Alert.alert('Submitting', 'Do you want to submit your answer!', [
      {
        text: 'Cancel',
        type: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          await createDataByCollection('exams-completed', {
            email: profile.email,
            subject: route.params.subject,
            result: Math.round((correctCount.length / userAnswers.length) * 100),
          });
          refetch();
          setIsSubmit(true);
        },
      },
    ]);
  };

  useEffect(() => {
    setUserAnswers(exams);
  }, [exams]);

  return (
    <View className="flex-1 px-6 py-3 bg-background">
      <ScrollView style={{ flex: 1 }} className="my-3">
        <View className="p-4 mb-4 bg-header">
          <Text className="font-semibold text-center text-white">{`${route.params.subject} Exam`}</Text>
        </View>
        <View className="flex-1">
          {isSubmit ? (
            <>
              <View className="flex items-center justify-center w-full py-3 mb-6 bg-header">
                <Text className="text-center text-white">{isCompleted ? 'Pass' : 'Fail'}</Text>
              </View>
              <View className="flex-row p-2 mb-6 space-x-3 bg-header">
                <Text className="text-white">Answers:</Text>
                <Text className={cn('font-semibold', isPassed ? 'text-main' : 'text-red-400')}>
                  {correctCount.length}
                </Text>
                <Text>/ {userAnswers.length}</Text>
              </View>
              <View className="flex-col w-full px-3 divide-y divide-white bg-header">
                {userAnswers.map((item, index) => (
                  <View className="flex-col py-3 " key={item.id}>
                    <Text className="font-semibold text-white">{index + 1}.</Text>
                    <Text className={cn('font-semibold ', item.answer === item.correct ? 'text-main' : 'text-red-400')}>
                      {item.answer}
                    </Text>
                    <Text className="font-semibold text-white">{item.correct}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View className="w-full px-3 divide-y divide-white bg-header">
              {exams.map((item, index) => (
                <View className="flex-col py-3 " key={index}>
                  <View>
                    <Text className="font-semibold text-white">
                      {index + 1}. {item.question}
                    </Text>
                  </View>
                  {item.answers.map((answer, subIndex) => (
                    <Answer
                      answer={answer}
                      userAnswers={userAnswers}
                      item={item}
                      key={answer + index}
                      subIndex={subIndex}
                      onSelectAnswer={onSelectAnswer}
                    />
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      {!isSubmit && <MyButton title="Complete" size="small" rootClassName="rounded-none" onPress={handleSubmit} />}
    </View>
  );
}

const Answer = memo(({ answer, subIndex, userAnswers, onSelectAnswer, item }) => {
  const target = userAnswers.find((item2) => item2.question === item.question);
  const isChecked = target && target.answer === answer;

  return (
    <View className="flex-row items-center mt-3">
      <Checkbox
        value={isChecked}
        onValueChange={() => onSelectAnswer(item, answer)}
        className="bg-[#D9D9D9] border-[#D9D9D9]"
        color={isChecked ? '#B5E48C' : undefined}
      />
      <Text className="flex-1 pl-3 font-semibold text-white">
        {subIndex === 0 ? 'A. ' : subIndex === 1 ? 'B. ' : subIndex === 2 ? 'C. ' : 'D. '}
        {answer}
      </Text>
    </View>
  );
});
