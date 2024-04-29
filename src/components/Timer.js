import React, { memo, useEffect, useRef, useState } from 'react';
import { useUserStore } from '../store/UserStore';
import { createDataByCollection, db, updateCollection } from '../firebaseConfig';
import { useAuthStore } from '../store/AuthStore';
export const MinuteToYear = 3;
import { doc, onSnapshot } from 'firebase/firestore';

function Timer() {
  const [second, setSecond] = useState(0);
  const { age, setSeconds, increaseAge, setAge } = useUserStore((state) => state);
  const { profile, setProfile, isLogged } = useAuthStore((state) => state);
  let snapRef = useRef();
  useEffect(() => {
    if (profile.email && isLogged) {
      snapRef.current = onSnapshot(doc(db, 'users', profile.email), (doc) => {
        const dataDoc = doc.data();
        console.log('dataDoc', dataDoc);

        setProfile(dataDoc);

        // ...
      });
    } else {
      if (snapRef.current) {
        snapRef.current();
      }
    }
  }, [profile.email, isLogged]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecond((prevSeconds) => {
        const updatedSeconds = prevSeconds + 1;
        // Nếu đạt đến 60 giây, đặt lại giây thành 0 và tăng phút lên 1
        if (updatedSeconds === MinuteToYear * 60) {
          increaseAge();
          return 0;
        }
        return updatedSeconds;
      });
    }, 1000);
    // Xóa interval khi component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (age === 18) {
      createDataByCollection('finance', {
        name: 'Enough 18 years old',
        value: 1000,
        email: profile.email,
      });
      updateCollection('users', profile.email, {
        balance: Number(profile.balance || 0) + 1000,
      });
    }
    if (age >= 100) {
      setAge(1);
    }
  }, [age]);

  useEffect(() => {
    setSeconds(second);
  }, [second]);

  return null;
}
export default memo(Timer);
