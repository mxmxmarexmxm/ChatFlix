import firebase from '../Firebase/Firebase';

let auth = firebase.auth();

export const signInWithGoogle = async () => {
  auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

export const signOut = async () => {
  try {
    const succes = auth.signOut();
    if (succes) {
      alert('You have been logged out successfully!');
    }
  } catch (err) {
    alert(err.message);
  }
};
