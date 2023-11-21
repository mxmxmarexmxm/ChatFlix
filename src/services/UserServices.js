import firebase from '../Firebase/Firebase';

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
        aboutMe: '',
        title: '',
        linkedin: '',
        github: '',
        technologies: [],
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
    await usersCollection.doc(uid).update(newData);
  } catch (error) {
    console.error('Error updating user data in Firestore:', error);
  }
};

// Update active and favorite chats in Firestore
export const updateUserChatsInFirestore = async (
  chatsBottom,
  chatsRight,
  favoriteChats
) => {
  const user = firebase.auth().currentUser;
  if (!user) {
    return;
  }
  const userId = user.uid;
  const db = firebase.firestore();
  const userRef = db.collection('users').doc(userId);

  try {
    await userRef.update({
      activeChatsBottom: chatsBottom,
      activeChatsRight: chatsRight,
      favoriteChats: favoriteChats,
    });
  } catch (error) {
    console.error('Error updating user document:', error);
  }
};

// Retrieve active and favorite chats from Firestore
export const getUserChatsFromFirestore = async () => {
  const auth = firebase.auth();
  const user = auth.currentUser;
  const userId = user.uid;
  const db = firebase.firestore();
  const userRef = db.collection('users').doc(userId);

  try {
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      const data = userDoc.data();
      return {
        activeChatsBottom: data.activeChatsBottom || [],
        activeChatsRight: data.activeChatsRight || [],
        favoriteChats: data.favoriteChats || [],
      };
    } else {
      console.error('User document does not exist');
      return {
        activeChatsBottom: [],
        activeChatsRight: [],
        favoriteChats: [],
      };
    }
  } catch (error) {
    console.error('Error getting user document:', error);
    return {
      activeChatsBottom: [],
      activeChatsRight: [],
      favoriteChats: [],
    };
  }
};
