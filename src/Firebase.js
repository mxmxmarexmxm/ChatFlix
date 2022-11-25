import firebase from 'firebase/compat/app';

let config = {
  apiKey: 'AIzaSyCGnuXdnQMlvNzacsnvuJQFlZJfcxhIb2E',
  authDomain: 'chat-app-f9610.firebaseapp.com',
  databaseURL: 'https://chat-app-f9610-default-rtdb.firebaseio.com',
  projectId: 'chat-app-f9610',
  storageBucket: 'chat-app-f9610.appspot.com',
  messagingSenderId: '747791044216',
  appId: '1:747791044216:web:1b3450c2d611b40e14678d',
};

firebase.initializeApp(config);

export default firebase;
