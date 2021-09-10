//import firebase from 'firebase';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'; 
import 'firebase/storage';




const firebaseConfig = {
    apiKey: "AIzaSyDQN88sTo1Vp-9mL0oiPeBydJF_1X0Xydw",
    authDomain: "agriculturalcostcontrol-546de.firebaseapp.com",
    projectId: "agriculturalcostcontrol-546de",
    storageBucket: "agriculturalcostcontrol-546de.appspot.com",
    messagingSenderId: "711077841157",
    appId: "1:711077841157:web:bc05c5bed7d41df0b4cf6c",
    measurementId: "G-GYKP849QH1" 
  };


  const fire = firebase.initializeApp(firebaseConfig);

  export default fire;

