import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  host,
  acceptFriendRoute,
  declineFriendRoute,
  getFriendRoute,
  getRequestFriendRoute,
  getChats,
} from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import SearchContact from "../components/SearchContact";
import {
  BsChatRightTextFill,
  BsFillEnvelopeFill,
  BsSearch,
} from "react-icons/bs";
import RequestFriend from "../components/RequestFriend";
import UserFriends from "../components/UserFriends";
import { toast, ToastContainer } from "react-toastify";
import ChatContainer from "../components/ChatContainer";
import Logut from "../components/Logut";
import { SET_CURRENT_USER } from "../reducers/currentUser";
import { helpHttp } from "../helpers/helpHttp";
import {
  ADD_REQUEST_FRIEND_USER,
  UPDATE_REQUEST_FRIEND_USER,
  SET_REQUEST_FRIENDS_OF_USER,
} from "../reducers/requestFriendsOfCurrentUser";
import Modal from "../components/Modal";
import Loader from "../assets/loader.gif";
import {
  ADD_FRIEND_USER,
  SET_FRIENDS_OF_USER,
} from "../reducers/friendsOfCurrentUser";
import { SET_CURRENT_CHAT } from "../reducers/currentChat";
import {
  ADD_CHAT_USER_RECEIVED,
  SET_CHATS_OF_USER,
  UPDATE_CHAT_RECEIVED_MESSAGE,
} from "../reducers/chatsOfCurrentUser";
import ChatsUser from "../components/ChatsUser";

const toastOptions = {
  position: "bottom-right",
  autoClose: 2000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

export default function Chat() {
  const [visibleSearch, setVisibleSearch] = useState(false);
  const [visibleRequestFriend, setVisibleRequestFriend] = useState(false);
  const [visibleFriends, setVisibleFriends] = useState(false);
  const currentUser = useSelector((state) => state.currentUser);
  const currentChat = useSelector((state) => state.currentChat);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = JSON.parse(localStorage.getItem("yen-app-user"));
      if (!user) navigate("/login");
      else dispatch(SET_CURRENT_USER(user));
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) return;
      else navigate("/set-avatar");
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("received-create-chat", (data) => {
        dispatch(ADD_CHAT_USER_RECEIVED(data));
      });

      socket.current.on("received-update-chat", (data) => {
        dispatch(UPDATE_CHAT_RECEIVED_MESSAGE(data));
      });

      socket.current.on("request-recieve", (requestFriend) => {
        toast.success(
          `you have new request friend of ${requestFriend.username}`,
          toastOptions
        );
        dispatch(ADD_REQUEST_FRIEND_USER(requestFriend));
      });

      socket.current.on("request-accept", (friend) => {
        toast.success(`you have new friend ${friend.username}`, toastOptions);
        dispatch(ADD_FRIEND_USER(friend));
      });
    }
  }, [socket.current]);

  const GET_FRIEND_REQUEST = () => {
    setLoading(true);
    helpHttp()
      .get(`${getRequestFriendRoute}/${currentUser._id}`)
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            setLoading(false);
            dispatch(SET_REQUEST_FRIENDS_OF_USER(request.requestFriends));
          } else {
            setLoading(false);
            toast.error(request.msg, toastOptions);
          }
        } else {
          setLoading(false);
          toast.error(request.statusText, toastOptions);
        }
      });
  };

  const GET_FRIENDS = () => {
    setLoading(true);
    helpHttp()
      .get(`${getFriendRoute}/${currentUser._id}`)
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            dispatch(SET_FRIENDS_OF_USER(request.friends));
          } else {
            toast.error(request.statusText, toastOptions);
            setLoading(false);
          }
        } else {
          setLoading(false);

          toast.error(request.statusText, toastOptions);
        }
      });
  };

  const GET_CHATS = () => {
    setLoading(true);
    helpHttp()
      .get(`${getChats}/${currentUser._id}`)
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            dispatch(SET_CHATS_OF_USER(request.chats));
          } else {
            toast.error(request.statusText, toastOptions);
            setLoading(false);
          }
        } else {
          setLoading(false);

          toast.error(request.statusText, toastOptions);
        }
      });
  };

  const acceptFriendRequest = (data) => {
    if (data) {
      helpHttp()
        .post(`${acceptFriendRoute}/${currentUser._id}`, {
          headers: {
            "content-type": "application/json",
          },
          body: data,
        })
        .then((request) => {
          if (!request.error) {
            if (request.status) {
              socket.current.emit("acceted-friend", {
                id: data._id,
                friend: request.userToFriend,
              });
              dispatch(UPDATE_REQUEST_FRIEND_USER(data._id));
              toast.success(request.msg, toastOptions);
            } else {
              toast.error(request.msg, toastOptions);
            }
          } else {
            toast.error(request.statusText, toastOptions);
          }
        });
    }
  };

  const declineFriendRequest = async (data) => {
    if (data) {
      let idTo = currentUser._id;
      helpHttp()
        .post(`${declineFriendRoute}/${currentUser._id}`, {
          headers: {
            "content-type": "application/json",
          },
          body: { ...data, idTo },
        })
        .then((request) => {
          if (!request.error) {
            if (request.status) {
              dispatch(UPDATE_REQUEST_FRIEND_USER(data._id));
              toast.success(request.msg, toastOptions);
            } else {
              toast.success(request.msg, toastOptions);
            }
          } else {
            toast.error(request.statusText, toastOptions);
          }
        });
    }
  };

  const handleVisibleSearch = () => {
    setVisibleRequestFriend(false);
    setVisibleSearch(!visibleSearch);
  };

  const handleChatChange = (chat) => {
    let currentChat = { ...chat, userId: chat._id };
    dispatch(SET_CURRENT_CHAT(currentChat));
    setVisibleSearch(false);
  };

  useEffect(() => {
    if (currentUser) {
      GET_CHATS();
      GET_FRIENDS();
      GET_FRIEND_REQUEST();
    }
  }, [currentUser]);

  return (
    <>
      {loading && (
        <Modal>
          <img src={Loader} alt="" />
        </Modal>
      )}
      <Container>
        <div className="container">
          {visibleSearch && (
            <SearchContact
              handleChatChange={handleChatChange}
              handleVisibleSearch={handleVisibleSearch}
              acceptFriendRequest={acceptFriendRequest}
              declineFriendRequest={declineFriendRequest}
              socket={socket}
            />
          )}
          {visibleRequestFriend && (
            <RequestFriend
              acceptFriendRequest={acceptFriendRequest}
              declineFriendRequest={declineFriendRequest}
            />
          )}
          {visibleFriends && (
            <UserFriends
              handleChatChange={handleChatChange}
              setVisibleFriends={setVisibleFriends}
            />
          )}
          <div className="options-container">
            <h3>Yen Chat</h3>
            <nav className="btn-options">
              <button
                onClick={() => {
                  setVisibleSearch(false);
                  setVisibleRequestFriend(!visibleRequestFriend);
                }}
              >
                {<BsFillEnvelopeFill />}
              </button>
              <button onClick={handleVisibleSearch}>{<BsSearch />}</button>
              <Logut />
            </nav>
            <button
              className="btn-show-friend"
              onClick={() => setVisibleFriends(true)}
            >
              {<BsChatRightTextFill />}
            </button>
          </div>
          <ChatsUser />
        </div>
        {currentChat ? <ChatContainer socket={socket} /> : null}
        {!currentChat && (
          <div className="welcome">
            {currentUser && (
              <h1>
                Welcome <span>{currentUser.username} ...</span>
              </h1>
            )}
          </div>
        )}
      </Container>
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  position: relative;
  height: 100vh;
  max-width: 1340px;
  top: -1rem;
  margin: auto;
  display: grid;
  grid-template-columns: 100%;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color-second);

  .welcome {
    display: none;
  }

  @media screen and (min-width: 720px) {
    grid-template-columns: 35% 65%;
    .welcome {
      display: flex;
      justify-content: center;
      align-items: center;
      h1 {
        color: white;
        font-size: 3.5rem;
        span {
          color: var(--second-color);
        }
      }
    }
  }
  @media screen and (min-width: 1024px) {
    grid-template-columns: 25% 75%;
  }

  .container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color-second);
    display: grid;
    grid-template-rows: 10% 90%;

    .options-container {
      margin: 0.2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      padding-top: 1.5rem;
      transition: all 0.5s;

      h3 {
        color: white;
      }

      .btn-options {
        display: flex;
        align-items: center;
        gap: 0 1rem;
        button {
          color: var(--second-color);
          font-size: 1.2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: transparent;
          border: none;
          cursor: pointer;
          &:hover {
            color: var(--primary-color);
          }
        }
      }
    }
  }

  .request-friend-container {
    position: relative;
  }

  .btn-show-friend {
    position: absolute;
    height: 2.8rem;
    width: 2.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    border-radius: 50%;
    padding: 0.4rem;
    color: var(--second-color);
    background-color: var(--bg-color-primary);
    bottom: 0;
    right: 0;
    cursor: pointer;
    border: none;
    margin: 2rem;
    transition: all 0.5s;
    &:hover {
      color: var(--primary-color);
    }
  }

  .avatar {
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    width: 3rem;
    background-color: var(--bg-color-second);
    img {
      height: 3rem;
    }
  }
`;
