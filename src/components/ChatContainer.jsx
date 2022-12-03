import React, { useEffect, useRef, useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { DEFAULT_CURRENT_CHAT } from "../reducers/currentChat";
import {
  createChat,
  getAllMessageRoute,
  readChat,
  sendMessageRoute,
  updateChat,
} from "../utils/APIRoutes";
import ChatInput from "./ChatInput";
import { helpHttp } from "../helpers/helpHttp";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../assets/loader.gif";
import {
  ADD_CHAT_USER,
  READ_CHAT,
  UPDATE_CHAT_SEND_MESSAGE,
} from "../reducers/chatsOfCurrentUser";

const toastOptions = {
  position: "bottom-right",
  autoClose: 2000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const ChatContainer = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const currentUser = useSelector((state) => state.currentUser);
  const currentChat = useSelector((state) => state.currentChat);
  const chatsOfCurrentUser = useSelector((state) => state.chatsOfCurrentUser);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const scrollRef = useRef();

  useEffect(() => {
    setLoading(true);
    helpHttp()
      .post(getAllMessageRoute, {
        headers: { "content-type": "application/json" },
        body: {
          from: currentUser._id,
          to: currentChat.userId,
        },
      })
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            setMessages(request.messages);
            setLoading(false);
          } else {
            toast.error(request.msg);
            setLoading(false);
          }
        } else {
          toast.error(request.statusText);
          setLoading(false);
        }
      });
  }, [currentChat]);

  const createChatOrUpdate = (msg) => {
    const findChat = chatsOfCurrentUser.find(
      (chat) => chat.userId == currentChat.userId
    );

    if (!findChat) {
      helpHttp()
        .post(`${createChat}/${currentUser._id}`, {
          headers: { "Content-type": "application/json" },
          body: {
            ...currentChat,
            lastMessage: msg,
          },
        })
        .then((request) => {
          if (!request.error) {
            if (request.status) {
              socket.current.emit("create-chat", request.createChatReceiver);
              dispatch(ADD_CHAT_USER(request.createChatSender));
            } else {
              console.error(request.msg);
            }
          } else {
            console.error(request.statusText);
          }
        });
    } else {
      helpHttp()
        .put(`${updateChat}/${currentUser._id}`, {
          headers: { "Content-type": "application/json" },
          body: {
            ...currentChat,
            lastMessage: msg,
          },
        })
        .then((request) => {
          if (!request.error) {
            if (request.status) {
              socket.current.emit("update-chat", {
                chatFromUser: currentUser._id,
                userId: currentChat.userId,
                lastMessage: msg,
              });
              dispatch(
                UPDATE_CHAT_SEND_MESSAGE({
                  userId: currentChat.userId,
                  lastMessage: msg,
                })
              );
            } else {
              console.error(request.msg);
            }
          } else {
            console.error(request.statusText);
          }
        });
    }
  };

  const handleSendMsg = (msg) => {
    helpHttp()
      .post(sendMessageRoute, {
        headers: {
          "content-type": "application/json",
        },
        body: {
          from: currentUser._id,
          to: currentChat.userId,
          message: msg,
        },
      })
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            createChatOrUpdate(msg);
            socket.current.emit("send-msg", {
              to: currentChat.userId,
              from: currentUser._id,
              message: msg,
            });
            const msgs = [...messages];
            msgs.push({ fromSelf: true, message: msg });
            setMessages(msgs);
          } else {
            toast.error(request.msg, toastOptions);
          }
        } else {
          toast.error(request.statusText, toastOptions);
        }
      });
  };

  const readMessage = () => {
    helpHttp()
      .put(`${readChat}/${currentUser._id}`, {
        headers: { "Content-Type": "application/json" },
        body: { userId: currentChat.userId },
      })
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            setTimeout(() => {
              dispatch(READ_CHAT({ userId: currentChat.userId }));
            }, 500);
          }
        }
      });
  };

  useEffect(() => {
    if (currentChat.view == false) {
      readMessage();
    }
  }, [currentChat]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (data) => {
        setArrivalMessage({ fromSelf: false, message: data.message, data });
      });
    }
  }, [socket.current]);

  useEffect(() => {
    if (arrivalMessage) {
      if (arrivalMessage.data.from === currentChat.userId) {
        setMessages((prev) => [...prev, arrivalMessage]);
        readMessage();
      }
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <>
      <Container>
        <div className="chat-header">
          <button onClick={() => dispatch(DEFAULT_CURRENT_CHAT())}>
            {<BsArrowLeftCircle />}
          </button>
          <div className="user-details">
            <div className="avatar">
              <img src={currentChat.avatarImage} alt="avatar" />
            </div>
            <div className="username">
              <h3>{currentChat.username}</h3>
            </div>
          </div>
        </div>
        <div className="chat-messages">
          {loading && (
            <div className="loader">
              <img src={Loader} alt="loader" />
            </div>
          )}
          {messages.map((msg, index) => (
            <div ref={scrollRef} key={index}>
              <div
                className={`message ${msg.fromSelf ? "sended" : "recieved"}`}
              >
                <p className="content">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
        <ChatInput handleSendMsg={handleSendMsg} />
      </Container>
      <ToastContainer />
    </>
  );
};

export default ChatContainer;

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 1rem;
  display: grid;
  grid-template-rows: 10% 80% 10%;
  background-color: var(--bg-color-second);
  z-index: 400;

  @media screen and (min-width: 720px) {
    position: relative;
  }

  .chat-header {
    display: flex;
    align-items: center;
    gap: 0 1rem;
    padding: 0 0.5rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
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
      .username {
        h3 {
          color: white;
        }
      }
    }

    button {
      color: var(--second-color);
      font-size: 1.4rem;
      display: flex;
      padding: 0.5rem 0;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.5s;
      &:hover {
        color: var(--primary-color);
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    .loader {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        height: 3rem;
      }
    }

    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        font-size: 1rem;
        padding: 0.5rem;
        border-radius: 1rem;
        font-weight: 500;
        color: #111;
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: var(--primary-color);
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: var(--second-color);
      }
    }
  }
`;
