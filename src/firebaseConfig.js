// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  addDoc,
  orderBy,
} from 'firebase/firestore';
import moment from 'moment';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA1ItofgGw0W8Q8khNR1TFEvHw5svYpD8I',
  authDomain: 'mpx-app-6d3c2.firebaseapp.com',
  projectId: 'mpx-app-6d3c2',
  storageBucket: 'mpx-app-6d3c2.appspot.com',
  messagingSenderId: '995724608389',
  appId: '1:995724608389:web:d29ad32aad1f7a9764baec',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
// const auth = getAuth(app);
export const db = getFirestore(app);

export const registerWithEmailAndPassword = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const createUser = async (data) => {
  try {
    const docRef = doc(db, 'users', data.email);
    return setDoc(docRef, {
      created: moment().toISOString(),
      ...data,
    });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};
export const createDataByCollection = async (name, data) => {
  try {
    const docRef = collection(db, name);
    return addDoc(docRef, {
      created: moment().toISOString(),
      ...data,
    });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};
export const updateCollection = async (name, id, data) => {
  const docRef = doc(db, name, id);
  return setDoc(
    docRef,
    {
      updated: moment().toISOString(),
      ...data,
    },
    { merge: true },
  );
};
export const getUserByEmail = async (email) => {
  const docRef = doc(db, 'users', email);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

export const sendResetPasswordEmail = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const getDataByCollection = async (collectionName, filter = {}) => {
  const { _startAt, _limit, _orderBy, _where, _sortByCreated, _order, search } = filter;
  try {
    let q = query(collection(db, collectionName));

    if (_where && _where.level) {
      q = query(q, where('level', '==', _where.level));
    }
    if (_where && _where.subject) {
      q = query(q, where('subject', '==', _where.subject));
    }
    if (_where && _where.email) {
      q = query(q, where('email', '==', _where.email));
    }

    if (_sortByCreated) {
      q = query(q, orderBy('created', 'asc'));
    }
    if (_orderBy) {
      q = query(q, orderBy(_orderBy, _order || 'asc'));
    }

    try {
      // const snapshot = await getCountFromServer(
      // 	query(collection(db, 'collectionName'))
      // );
      // const count = snapshot.data().count;
      const querySnapshot = await getDocs(q);
      const data = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const item = await doc.data();
          return { ...item, id: doc.id };
        }),
      );
      return {
        data: data,
        // count,
      };
    } catch (e) {
      console.log('error', e.message);
      return { data: [], count: 0 };
    }
  } catch (e) {
    console.log('error 0', e.message);

    message.error(e.message);
    return { data: [], count: 0 };
  }
};
