import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from "firebase/functions";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.FIREBASE_API_KEY,
  authDomain: "breadfruit-tracker.firebaseapp.com",
  projectId: "breadfruit-tracker",
  storageBucket: "gs://breadfruit-tracker.firebasestorage.app",
  messagingSenderId: "1002993131736",
  appId: "1:1002993131736:android:865f3aedc2301fb68537ad",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const fireStore = getFirestore(app);
export const functions = getFunctions(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
