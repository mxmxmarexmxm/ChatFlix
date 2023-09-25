import firebase from '../Firebase/Firebase';
let auth = firebase.auth();

export const signInWithGoogle = async () => {
  auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const success = await auth.signInWithPopup(provider);
    if (success) {
      const user = success.user;
      addUserToFirestore(user); 
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

export const addUserToFirestore = async (user) => {
  try {
    const db = firebase.firestore();
    const usersCollection = db.collection('users');

    // Check if the user document already exists
    const userDoc = await usersCollection.doc(user.uid).get();

    if (!userDoc.exists) {
      // User document does not exist, create it
      await usersCollection.doc(user.uid).set({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    } else {
      console.log('User document already exists in Firestore.');
    }
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
  }
};

// Function to fetch user data from Firestore by UID
export const getUserDataFromFirestore = async (uid) => {
  try {
    const db = firebase.firestore();
    const usersCollection = db.collection('users');

    // Fetch the user document by UID
    const userDoc = await usersCollection.doc(uid).get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      return userData;
    } else {
      console.log('User document not found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data from Firestore:', error);
    return null;
  }
};

// Function to update user data in Firestore
export const updateUserDataInFirestore = async (uid, newData) => {
  try {
    const db = firebase.firestore();
    const usersCollection = db.collection('users');

    // Update the user document by UID with the new data
    await usersCollection.doc(uid).update(newData);

    console.log('User data updated in Firestore collection.');
  } catch (error) {
    console.error('Error updating user data in Firestore:', error);
  }
};
