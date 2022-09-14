import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import avatar from "../assets/img/avatar.jpg";
import Delete from "../components/Delete";
import Camera from "../components/Camera";
import { service } from "../service";

export default function Profile() {
  const history = useNavigate("");

  const [img, setImg] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (img) {
      uploadImg();
      getUser();
    }
  }, [img]);

  const getUser = async () => {
    let info = await service.getUser();
    console.log(info);
    setUser(info);
  };

  const uploadImg = async () => {
    try {
      if (user.avatarPath) {
        await service.deleteImage(user.avatarPath);
      }
      await service.uploadEmptyAvatar();
      await service.uploadImage(img);
      setImg("");
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteImage = async () => {
    try {
      const confirm = window.confirm("Delete avatar?");
      if (confirm) {
        await service.deleteImage(user.avatarPath);
        await service.uploadEmptyAvatar();
        history.replace("/");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="container profile">
      <div className="profile-img">
        <img src={user?.avatar || avatar} alt="avatar" />
        <div className="overlay">
          <div>
            <label htmlFor="photo">
              <Camera />
            </label>
            {user?.avatar ? <Delete deleteImage={deleteImage} /> : null}
            <input
              id="photo"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setImg(e.target.files[0])}
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="profile-info">
        <h3>{user?.name}</h3>
        <p>{user?.username}</p>
        <small>Registered on: {user?.createdAt.toDate().toDateString()}</small>
      </div>
    </div>
  );
}
