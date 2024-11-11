import { initializeApp } from 'firebase/app';
import { getAuth,GoogleAuthProvider,signInWithPopup,GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCIycGGkojSJv6EfPicWh_HNxqhMVIxTm0",
    authDomain: "nekoscan-fc0e8.firebaseapp.com",
    projectId: "nekoscan-fc0e8",
    storageBucket: "nekoscan-fc0e8.firebasestorage.app",
    messagingSenderId: "764062011489",
    appId: "1:764062011489:web:533757809ebbd93e175a20",
    measurementId: "G-Y5ZCTKSP18"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider()