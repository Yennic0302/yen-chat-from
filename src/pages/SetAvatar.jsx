import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAvatarRoute } from "../utils/APIRoutes";
import avartarDefault from "../assets/user-default.png";
import Loader from "../assets/loader.gif";
import { useNavigate } from "react-router-dom";
import { helpHttp } from "../helpers/helpHttp";
import Modal from "../components/Modal";

const toastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const SetAvatar = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const setProfilePicture = async () => {
    let user = await JSON.parse(localStorage.getItem("yen-app-user"));

    let options = {
      headers: {
        "content-type": "application/json",
      },
      body: {
        image: avatar || avartarDefault,
      },
    };

    setLoading(true);

    helpHttp()
      .post(`${setAvatarRoute}/${user._id}`, options)
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            setLoading(false);
            toast.success(request.msg, toastOptions);
            user.isAvatarImageSet = request.isAvatarImageSet;
            user.avatarImage = request.avatarImage;
            localStorage.setItem("yen-app-user", JSON.stringify(user));
            setTimeout(() => {
              navigate("/chat");
            }, 3000);
          } else {
            setLoading(false);
            toast.error(request.msg, toastOptions);
          }
        } else {
          setLoading(false);
          toast.error("error set avatar, please try again", toastOptions);
        }
      });
  };

  const loadImagePicture = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatar(event.currentTarget.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("yen-app-user"));
    if (user) {
      if (user.isAvatarImageSet) navigate("/chat");
      else return;
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      {loading && (
        <Modal>
          <img src={Loader} alt="" />
        </Modal>
      )}
      <Container>
        <div className="titleContainer">
          <h1>Pick an avatar as your profile picture</h1>
        </div>

        <div className="avatar-user-container">
          {avatar ? (
            <img src={avatar} alt="avatar" />
          ) : (
            <img src={avartarDefault} alt="avatar-default" />
          )}
        </div>
        <div className="btn-add-picture">
          <label htmlFor="file-picture" className="file-picture">
            Select a picture
          </label>
          <input
            hidden
            type="file"
            id="file-picture"
            onChange={loadImagePicture}
          />
        </div>

        <button className="submit-btn" onClick={setProfilePicture}>
          Set as profile picture
        </button>
      </Container>
      <ToastContainer />
    </>
  );
};

export default SetAvatar;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: var(--bg-color-primary);
  height: 100vh;
  width: 100vw;

  .titleContainer {
    h1 {
      color: white;
    }
  }

  .avatar-user-container {
    height: 15rem;
    width: 15rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
    img {
      object-fit: contain;
      height: 100%;
      width: 100%;
    }
  }

  .file-picture {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background-color: var(--second-color);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    &:hover {
      background-color: var(--primary-color);
    }
  }
  .submit-btn {
    background-color: var(--second-color);
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: var(--primary-color);
    }
  }
`;
