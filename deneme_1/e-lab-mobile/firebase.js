import { initializeApp } from 'firebase/app';
import { getAuth, browserSessionPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID } from '@env';

const firebase = {
  apiKey: "AIzaSyAvfCI7cWwbwEU7j5dgoRJg_F2Bw6sMMas",
  authDomain: "e-lab-77916.firebaseapp.com",
  projectId: "e-lab-77916",
  storageBucket: "e-lab-77916.firebasestorage.app",
  messagingSenderId: "806653680618",
  appId: "1:806653680618:web:fde3ad64bcfc90eaf4b093",
};

const app = initializeApp(firebase);
const auth = getAuth(app);
const firestore = getFirestore(app);

setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log('Firebase authentication persistence is set to session');
  })
  .catch((error) => {
    console.error('Failed to set auth persistence:', error);
  });

export { auth, firestore };
