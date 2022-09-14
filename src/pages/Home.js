import React, { useEffect, useState } from "react";
import { db, auth, storage } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import User from "../components/User";
import MessageForm from "../components/MessageForm";
import Message from "../components/Message";
import avatar from "../assets/img/avatar.jpg";

export default function Home() {
  const currentUser = auth.currentUser; //.uid;

  const [senders, setSenders] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [currentUser.uid]));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      console.log(users);
      setSenders(users);
    });
    return () => unsub();
  }, []);

  const handleSelectUser = async (user) => {
    setChat(user);

    const id = currentUser.uid > user.uid ? `${currentUser.uid + user.uid}` : `${user.uid + currentUser.uid}`;

    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMessages(msgs);
    });

    // get last message b/w logged in user and selected user
    const docSnap = await getDoc(doc(db, "lastMsg", id));
    // if last message exists and message is from selected user
    if (docSnap.data() && docSnap.data().from !== currentUser.uid) {
      // update last message doc, set unread to false
      await updateDoc(doc(db, "lastMsg", id), { unread: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = currentUser.uid > chat.uid ? `${currentUser.uid + chat.uid}` : `${chat.uid + currentUser.uid}`;

    let url;
    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
    }

    await addDoc(collection(db, "messages", id, "chat"), {
      text,
      from: currentUser.uid,
      to: chat.uid,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });

    await setDoc(doc(db, "lastMsg", id), {
      text,
      from: currentUser.uid,
      to: chat.uid,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    });

    setText("");
    setImg("");
  };

  return (
    <div className="home">
      <div className="users">
        {senders.map((sender) => (
          <User
            key={sender.uid}
            secondUser={sender}
            handleSelectUser={handleSelectUser}
            currentUser={currentUser}
            chat={chat}
          />
        ))}
      </div>
      <div className="messages">
        {chat ? (
          <>
            <div className="user-message">
            <img
              src={chat.avatar || avatar}
              alt="avatar"
              className="avatar"
            />
              <h3>{chat.name}</h3>
            </div>
            <div className="items">
              {messages?.map((msg, i) => (
                    <Message key={i} msg={msg} currentUser={currentUser} />
                  ))
              }
            </div>
            <MessageForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setImg={setImg}
            />
          </>
        ) : (
          <h3 className="empty">Select a user to start conversation</h3>
        )}
      </div>
    </div>
  );
}
