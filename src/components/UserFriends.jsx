import React from "react";
import { BsArrowLeftCircle, BsFillPeopleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import styled from "styled-components";

const UserFriends = ({ setVisibleFriends, handleChatChange }) => {
  const friendsOfCurrentUser = useSelector(
    (state) => state.friendsOfCurrentUser
  );

  return (
    <Container>
      <div className="nav-friends">
        <button onClick={() => setVisibleFriends(false)}>
          {<BsArrowLeftCircle />}
        </button>

        <h3>Select Contact</h3>
      </div>
      <div>
        {friendsOfCurrentUser.length > 0 ? (
          friendsOfCurrentUser.map((friend) => (
            <div
              key={friend._id}
              className="friend-container"
              onClick={() => handleChatChange(friend)}
            >
              <div className="avatar">
                <img src={friend.avatarImage} alt="" />
              </div>
              <div className="username">
                <h3>{friend.username}</h3>
              </div>
              <div>
                <button>{<BsFillPeopleFill />}</button>
              </div>
            </div>
          ))
        ) : (
          <h3>Do yo not have friends</h3>
        )}
      </div>
    </Container>
  );
};

export default UserFriends;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: grid;
  padding: 0.5rem 1rem;
  grid-template-rows: 10% 90%;
  background-color: var(--bg-color-second);
  z-index: 400;

  .nav-friends {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    color: white;
    gap: 0 1rem;
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

  .friend-container {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.5rem;
    display: grid;
    grid-template-columns: 15% 70% 15%;
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
`;
