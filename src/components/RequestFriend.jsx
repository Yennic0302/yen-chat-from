import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { BsFillBookmarkCheckFill, BsFillBookmarkXFill } from "react-icons/bs";

const RequestFriend = ({ acceptFriendRequest, declineFriendRequest }) => {
  const requestFriendsOfCurrentUser = useSelector(
    (state) => state.requestFriendsOfCurrentUser
  );

  return (
    <Container>
      <h3>Your Friends requests</h3>
      {requestFriendsOfCurrentUser.length > 0 ? (
        requestFriendsOfCurrentUser.map((user) => (
          <div key={user._id} className="container-friend-request">
            <div className="avatar">
              <img src={user.avatarImage} alt="" />
            </div>
            <div className="username">
              <h3>{user.username}</h3>
            </div>
            <div className="user-nav">
              <button
                className="btn-accept"
                onClick={() => acceptFriendRequest(user)}
              >
                {<BsFillBookmarkCheckFill />}
              </button>
              <button
                className="btn-decline"
                onClick={() => declineFriendRequest(user)}
              >
                {<BsFillBookmarkXFill />}
              </button>
            </div>
          </div>
        ))
      ) : (
        <h3>Do you not have friends requests</h3>
      )}
    </Container>
  );
};

export default RequestFriend;

const Container = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  flex-direction: column;
  top: 4.5rem;
  width: 100%;
  height: 90vh;
  overflow: auto;
  background: var(--bg-color-second);
  z-index: 500;
  color: white;

  .loader {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 3rem;
    }
  }

  .container-friend-request {
    width: 100%;
    margin-top: 0.5rem;
    padding: 1rem;
    display: grid;
    grid-template-columns: 15% 65% 20%;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-color-primary);
    overflow: hidden;
    border-radius: 0.5rem;
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
