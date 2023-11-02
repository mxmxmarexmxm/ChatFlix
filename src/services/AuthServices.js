import firebase from '../Firebase/Firebase';
import {
  sendPasswordResetEmail,
  FacebookAuthProvider,
  getAuth,
  signInWithPopup,
} from 'firebase/auth';
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

export const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      // The signed-in user info.
      const user = result.user;

      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;

      console.log(user);

      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);
      console.log(errorMessage);
      // ...
    });
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
      // const errorCode = error.code;
      const errorMessage = error.message;
      return errorMessage;
    });
};
