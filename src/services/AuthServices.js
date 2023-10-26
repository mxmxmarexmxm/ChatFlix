import firebase from '../Firebase/Firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
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

export const resetPassword = async (email) => {
  return sendPasswordResetEmail(auth, email)
    .then(() => {
      return 'Password reset email sent!';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return errorCode + errorMessage;
    });
};
