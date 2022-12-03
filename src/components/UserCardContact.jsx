import React from "react";
import styled from "styled-components";
import {
  BsFillPersonPlusFill,
  BsFillPersonCheckFill,
  BsFillPeopleFill,
  BsFillBookmarkCheckFill,
  BsFillBookmarkXFill,
} from "react-icons/bs";
import { useState } from "react";

const UserCardContact = ({
  data,
  sendRequestfriend,
  acceptFriendRequest,
  declineFriendRequest,
  handleChatChange,
}) => {
  const [isSend, setIsSend] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isDecline, setIsDecline] = useState(false);

  const optionsFriend = () => {
    if (isFriend) {
      return <button>{<BsFillPeopleFill />}</button>;
    }

    if (isDecline) {
      return (
        <button>
          <BsFillPersonPlusFill />
        </button>
      );
    }

    return (
      <>
        <button
          className="btn-accept"
          onClick={() => {
            setIsFriend(true);
            acceptFriendRequest(data.user);
          }}
        >
          {<BsFillBookmarkCheckFill />}
        </button>
        <button
          className="btn-decline"
          onClick={() => {
            setIsDecline(true);
            declineFriendRequest(data.user);
          }}
        >
          {<BsFillBookmarkXFill />}
        </button>
      </>
    );
  };

  const renderSwitch = (param) => {
    switch (param) {
      case "NONE":
        return (
          <button
            onClick={() => {
              setIsSend(true);
              sendRequestfriend(data.user);
            }}
          >
            {isSend ? <BsFillPersonCheckFill /> : <BsFillPersonPlusFill />}
          </button>
        );
      case "REQUEST-SEND":
        return <button>{<BsFillPersonCheckFill />}</button>;

      case "FRIEND":
        return <button>{<BsFillPeopleFill />}</button>;

      case "REQUEST-RECIVED":
        return <div className="user-nav">{optionsFriend()}</div>;
    }
  };

  return (
    <Container onClick={() => handleChatChange(data.user)}>
      <div className="avatar">
        <img src={data.user.avatarImage} alt="" />
      </div>
      <div className="username">
        <h3>{data.user.username}</h3>
      </div>
      <div className="user-nav" onClick={(e) => e.stopPropagation()}>
        {renderSwitch(data.friendStatus)}
      </div>
    </Container>
  );
};

export default UserCardContact;

const Container = styled.div`
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5rem;
  display: grid;
  grid-template-columns: 15% 65% 20%;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background-color: var(--bg-color-primary);

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
    color: white;
    display: flex;
    align-items: center;
    h3 {
      padding: 1rem;
    }
  }

  .user-nav {
    display: flex;
    align-items: center;
    gap: 0 0.5rem;
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
    .btn-accept {
      color: #2ada4e;
    }

    .btn-decline {
      color: #fa4e2a;
    }
  }
`;
