import React, { useState, useEffect, memo, useCallback } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';
import MyButton from '../../components/MyButton';
import useQuery from '../../hooks/useQuery';
import { cn } from '../../utils';
import { updateCollection } from '../../firebaseConfig';
import { useAuthStore } from '../../store/AuthStore';
import moment from 'moment';

export default function ExamsScreen({ navigation, route }) {
  const [isSubmit, setIsSubmit] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const profile = useAuthStore((state) => state.profile);
  const isSchoolCompleted = profile[`isSchool${route.params.level}Completed`];
  const result = profile[`school${route.params.level}Result`];
  const isPassed = result > 50;
  const { data: exams } = useQuery('exams', {
    _where: {
      level: route.params.level,
    },
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

  const correctCount = userAnswers.filter((item) => item.answer === item.correct);

  const handleSubmit = () => {
    Alert.alert('Submitting', 'Do you want to submit your answer!', [
      {
        text: 'Cancel',
        type: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          setIsSubmit(true);
          updateCollection('users', profile.email, {
            [`isSchool${route.params.level}Completed`]: true,
            [`school${route.params.level}CompletedAt`]: moment().toISOString(),
            [`school${route.params.level}Result`]: (correctCount.length / userAnswers.length) * 100,
          });
        },
      },
    ]);
  };

  const handleReset = () => {
    setIsSubmit(false);
    setUserAnswers(exams);
  };
  useEffect(() => {
    setUserAnswers(exams || []);
  }, [exams]);

  return (
    <View className="flex-1 px-6 py-3 bg-background">
      <ScrollView style={{ flex: 1 }} className="my-3">
        <View className="p-4 mb-4 bg-header">
          <Text className="font-semibold text-center text-white">{`Course Final Exam`}</Text>
        </View>
        {isSchoolCompleted ? (
          <>
            <View className="flex items-center justify-center w-full h-32 mb-6 bg-header">
              <Text className="text-xl text-center text-white">
                {isPassed
                  ? `Congratulation! \nYou have enough conditionto graduate`
                  : `Bad test. Not Qualified!\nYou're got the learning warning.\nHowever, you still graduate`}
              </Text>
            </View>
            <View className="p-2 mb-6 bg-header">
              <Text className="text-white">
                Answers:
                <Text className={cn('font-semibold pl-4', isPassed ? 'text-main' : 'text-red-400')}>
                  {correctCount.length}
                </Text>{' '}
                / {userAnswers.length}
              </Text>
            </View>
            <View className="w-full px-3 divide-y divide-white bg-header">
              {userAnswers.map((item, index) => (
                <View className="flex-col py-2 " key={index}>
                  <View className="flex-row items-center justify-between">
                    <Text className="font-semibold text-white">{index + 1}.</Text>
                    <Text className={cn('font-semibold ', item.answer === item.correct ? 'text-main' : 'text-red-400')}>
                      {item.answer}
                    </Text>
                    <Text className="font-semibold text-white">{item.correct}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View className="w-full px-3 divide-y divide-white bg-header">
            {exams &&
              exams.map((item, index) => (
                <View className="flex-col py-3 " key={index}>
                  <View>
                    <Text className="font-semibold text-white">
                      {index + 1}. {item.question}
                    </Text>
                  </View>
                  <View className="flex-row flex-wrap mt-4">
                    {item.answers &&
                      item.answers.map((answer, subIndex) => (
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
                </View>
              ))}
          </View>
        )}
      </ScrollView>
      {!isSubmit ? (
        <MyButton title="Complete" size="small" rootClassName="rounded-none" onPress={handleSubmit} />
      ) : (
        !isSchoolCompleted && (
          <MyButton title="Try Again" size="small" rootClassName="rounded-none" onPress={handleReset} />
        )
      )}
    </View>
  );
}

const Answer = memo(({ answer, subIndex, userAnswers, onSelectAnswer, item }) => {
  const target = userAnswers.find((item2) => item2.question === item.question);
  const isChecked = target && target.answer === answer;

  return (
    <View className="flex-row items-center flex-1 ">
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
