import { getApp,getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyCGouBH9QVh58S25etXd1i9YbIjofTzcLc",
    authDomain: "notion-on-steroids.firebaseapp.com",
    projectId: "notion-on-steroids",
    storageBucket: "notion-on-steroids.appspot.com",
    messagingSenderId: "346357887290",
    appId: "1:346357887290:web:4a071234f776b219e4a003"
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  const db = getFirestore(app)

  export{db};

