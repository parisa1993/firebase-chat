import React, { useEffect, useState } from "react";
import avatar from "../assets/img/avatar.jpg";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function User({ currentUser, secondUser, handleSelectUser, chat }) {
    
  const [data, setData] = useState("");

  useEffect(() => {
    const id = currentUser?.uid > secondUser?.uid ? `${currentUser?.uid + secondUser?.uid}` : `${secondUser?.uid + currentUser?.uid}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);

  return (
    <>
    <div
      className={`senders ${chat.name === secondUser.name && "selected_user"}`}
      onClick={() => handleSelectUser(secondUser)}
    >
      <div className="user_info">
        <div className="user_detail">
          <img src={secondUser.avatar || avatar} alt="avatar" className="avatar" />
          <h4>{secondUser.name}</h4>
          {data?.from !== currentUser?.uid && data?.unread && (
            <small className="unread">New</small>
          )}
        </div>
        <div
          className={`user_status ${secondUser.isOnline ? "online" : "offline"}`}
        ></div>
      </div>
      {data && (
        <p className="truncate">
          <strong>{data.from === currentUser?.uid ? "Me:" : null}</strong>
          {data.text}
        </p>
      )}
    </div>
    {/* <div
      onClick={() => handleSelectUser(secondUser)}
      className={`sm_container ${chat.name === secondUser.name && "selected_user"}`}
    >
      <img
        src={secondUser.avatar || avatar}
        alt="avatar"
        className="avatar sm_screen"
      />
    </div> */}
  </>
  )
}



