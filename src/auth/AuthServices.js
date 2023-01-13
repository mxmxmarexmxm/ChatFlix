import firebase from '../Firebase/Firebase';

let auth = firebase.auth();

export  const signInWithGoogle = () => {
  auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

export const signOut = () => {
  auth.signOut();
};
