import firebase from '../Firebase/Firebase';

let auth = firebase.auth();

export const signInWithGoogle = async () => {
  auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const success = await auth.signInWithPopup(provider);
    if (success) {
      alert('You have been logged in successfully!');
    }
  } catch (err) {
    alert(err.message);
  }
};

export const signOut = async () => {
  try {
    const success = auth.signOut();
    if (success) {
      alert('You have been logged out successfully!');
    }
  } catch (err) {
    alert(err.message);
  }
};
