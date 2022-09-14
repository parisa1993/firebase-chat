import { auth, db, storage } from "./firebase";
import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import {
  Timestamp,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

const signout = async () => {
  await updateDoc(doc(db, "users", auth.currentUser.uid), {
    isOnline: false,
  });
  await signOut(auth);
};

const deleteImage = async (avatarPath) => {
  await deleteObject(ref(storage, avatarPath));
};

const uploadEmptyAvatar = async () => {
  await updateDoc(doc(db, "users", auth.currentUser.uid), {
    avatar: "",
    avatarPath: "",
  });
};

const uploadImage = async (img) => {
  const imgRef = ref(storage, `avatar/${new Date().getTime()} - ${img.name}`);
  const snap = await uploadBytes(imgRef, img);
  const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

  await updateDoc(doc(db, "users", auth.currentUser.uid), {
    avatar: url,
    avatarPath: snap.ref.fullPath,
  });
};

const getUser = async () => {
  return getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
    if (docSnap.exists) {
      return docSnap.data();
    }
    else return null;
  });
}

const login = async(username, password) =>{
  const result = await signInWithEmailAndPassword(auth, username, password);
      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true,
      });
}

const register = async (name, username, password) =>{
  const result = await createUserWithEmailAndPassword(
    auth,
    username,
    password
  );
  await setDoc(doc(db, "users", result.user.uid), {
    uid: result.user.uid,
    name,
    username,
    createdAt: Timestamp.fromDate(new Date()),
    isOnline: true,
  });
}

export const service = {
  signout,
  deleteImage,
  uploadEmptyAvatar,
  uploadImage,
  getUser,
  login,
  register
};
