import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

let app = {
  apiKey: 'AIzaSyDd1OJnvYKP6Bs05qqtOzm1L_3QSxA5J9w',
  authDomain: 'chatflix-6ebaf.firebaseapp.com',
  projectId: 'chatflix-6ebaf',
  storageBucket: 'chatflix-6ebaf.appspot.com',
  messagingSenderId: '382598738818',
  appId: '1:382598738818:web:d4aef2083787dc2514559b',
};

firebase.initializeApp(app);

export default firebase;
