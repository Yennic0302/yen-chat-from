import React, { useState } from "react";
import styled from "styled-components";
import { IoMdSend } from "react-icons/io";

const ChatInput = ({ handleSendMsg }) => {
  const [msg, setMsg] = useState("");

  const sendChat = (e) => {
    e.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <form className="input-container" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Type your message here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button className="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
};

export default ChatInput;

const Container = styled.div`
  display: grid;
  grid-template-columns: 90% 10%;
  align-items: center;
  background-color: var(--bg-color-primary);
  padding: 0 0.5rem;
  padding-bottom: 0.3rem;

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;

      word-wrap: break-word;
      border: none;
      padding-left: 1rem;
      font-size: 1rem;
      &::selection {
        background-color: #9185f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 1rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--second-color);
      border: none;
      cursor: pointer;
      svg {
        font-size: 1.5rem;
        color: white;
      }
    }
  }
`;
