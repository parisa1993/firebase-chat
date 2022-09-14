import React, { useRef, useEffect } from "react";
import Moment from "react-moment";

export default function Message({ msg, currentUser }) {
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [msg]);

  return (
    <div
      className={`message_wrapper ${msg.from === currentUser.uid ? "own" : ""}`}
      ref={scrollRef}
    >
      <p className={msg.from === currentUser.uid ? "me" : "friend"}>
        {msg.media ? <img src={msg.media} alt={msg.text} /> : null}
        <span>{msg.text}</span>
        <br />
        <small>
          <Moment fromNow>{msg.createdAt.toDate()}</Moment>
        </small>
      </p>
    </div>
    
  )
}