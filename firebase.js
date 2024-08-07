import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyAZKmydOGJZdcBWNS6Z1JoYFLo2gwWTv6M",
    authDomain: "food-tracker-29f50.firebaseapp.com",
    projectId: "food-tracker-29f50",
    storageBucket: "food-tracker-29f50.appspot.com",
    messagingSenderId: "852430822339",
    appId: "1:852430822339:web:a2d39bd5d987ec9ee87b76"
  };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { app, firestore };