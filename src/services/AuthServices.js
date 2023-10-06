import firebase from '../Firebase/Firebase';
let auth = firebase.auth();

export const signInWithGoogle = async () => {
  auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const success = await auth.signInWithPopup(provider);
    return success;
  } catch (err) {
    console.error('Error signing in with Google:', err);
    alert(err.message);
    return null;
  }
};

export const signOut = async () => {
  try {
    auth.signOut();
  } catch (err) {
    alert(err.message);
  }
};
