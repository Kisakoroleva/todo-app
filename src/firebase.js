import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbszlKwzFQrkwlAKVvD3RwgTTtSXhSsKQ",
  authDomain: "todo-fa19d.firebaseapp.com",
  projectId: "todo-fa19d",
  storageBucket: "todo-fa19d.firebasestorage.app",
  messagingSenderId: "59386760286",
  appId: "1:59386760286:web:42a8732008775b509bf8cf"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);