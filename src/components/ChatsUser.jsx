import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { SET_CURRENT_CHAT } from "../reducers/currentChat";

const ChatsUser = () => {
  const chatsOfCurrentUser = useSelector((state) => state.chatsOfCurrentUser);
  const dispatch = useDispatch();

  return (
    <Conatiner>
      <h3>Chats</h3>
      {chatsOfCurrentUser.length > 0 ? (
        chatsOfCurrentUser.map((chat) => (
          <div
            key={chat._id}
            onClick={() => dispatch(SET_CURRENT_CHAT(chat))}
            className="chat"
          >
            <div className="avatar">
              <img src={chat.avatarImage} alt="" />
            </div>
            <div className="details">
              <h3>{chat.username}</h3>
              <div className="last-message-container">
                <h5
                  className={
                    chat.view ? "last-message-read" : "last-message-not-read"
                  }
                >
                  {chat.lastMessage}
                </h5>
                <div
                  className={
                    chat.view ? "is-read-message" : "is-not-read-message"
                  }
                >
                  {chat.messagesPending}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h3>Do you not have Chats</h3>
      )}
    </Conatiner>
  );
};

export default ChatsUser;

const Conatiner = styled.div`
  padding: 0.5rem 1rem;
  color: white;
  height: 100%;
  width: 100%;
  margin-top: 0.5rem;
  overflow: auto;

  .chat {
    width: 100%;
    padding: 1rem;
    display: grid;
    margin-top: 0.5rem;
    grid-template-columns: 20% 80%;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 0.5rem;
    background-color: var(--bg-color-primary);
    overflow: hidden;

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
    .details {
      color: white;

      .last-message-read {
        color: #aaa;
        font-size: 0.8rem;
        width: 100%;
        height: 1rem;
        overflow: hidden;
      }

      .last-message-not-read {
        color: var(--primary-color);
        font-size: 0.8rem;
        width: 100%;
        height: 1rem;
        overflow: hidden;
      }

      .last-message-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0 0.5rem;

        .is-read-message {
          display: none;
        }
        .is-not-read-message {
          display: flex;
          font-size: 0.7rem;
          justify-content: center;
          align-items: center;
          padding: 0.3rem;
          height: 1rem;
          width: 1rem;
          border-radius: 50%;
          background-color: var(--primary-color);
        }
      }
    }
  }
`;
