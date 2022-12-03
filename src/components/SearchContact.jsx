import styled from "styled-components";
import { useState } from "react";
import { useSelector } from "react-redux";
import { helpHttp } from "../helpers/helpHttp";
import UserCardContact from "./UserCardContact.jsx";
import { requestFriendRoute, searchUserRoute } from "../utils/APIRoutes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsArrowLeftCircle } from "react-icons/bs";
import Loader from "../assets/loader.gif";

const toastOptions = {
  position: "bottom-right",
  autoClose: 2000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const SearchContact = ({
  handleVisibleSearch,
  acceptFriendRequest,
  declineFriendRequest,
  handleChatChange,
  socket,
}) => {
  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.currentUser);

  const searchUser = async (e) => {
    setLoading(true);
    helpHttp()
      .get(`${searchUserRoute}/${currentUser._id}?search=${e.target.value}`)
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            setSearch(request.resultSearch);
            setLoading(false);
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

  const sendRequestfriend = (user) => {
    let { _id, username, avatarImage, email } = currentUser;
    helpHttp()
      .post(`${requestFriendRoute}/${user._id}`, {
        headers: { "content-type": "application/json" },
        body: { _id, username, avatarImage, email },
      })
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            console.log("send request");
            socket.current.emit("send-request-friend", {
              id: user._id,
              requestFriend: { _id, username, avatarImage, email },
            });

            toast.success(request.msg, toastOptions);
          } else {
            toast.error(request.msg, toastOptions);
          }
        } else {
          toast.error(request.statusText, toastOptions);
        }
      });
  };

  return (
    <>
      <Container>
        <div className="input-search-container">
          <button onClick={handleVisibleSearch}>{<BsArrowLeftCircle />}</button>
          <input
            type="text"
            id="search-contact"
            onChange={searchUser}
            placeholder="Type a user"
            autoFocus
            autoComplete="off"
          />
        </div>
        <div className="results-search">
          <h3>results:</h3>
          {loading && (
            <div className="loader">
              <img src={Loader} alt="loader" />
            </div>
          )}
          {search.map((data) => (
            <UserCardContact
              key={data.user._id}
              handleChatChange={handleChatChange}
              sendRequestfriend={sendRequestfriend}
              acceptFriendRequest={acceptFriendRequest}
              declineFriendRequest={declineFriendRequest}
              data={data}
            />
          ))}
        </div>
      </Container>
      <ToastContainer />
    </>
  );
};

export default SearchContact;

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  animation: show 0.5s ease-in-out;
  z-index: 900;

  .input-search-container {
    width: 100%;
    display: grid;
    justify-content: center;
    align-items: center;
    grid-template-columns: 12% 88%;

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

    input {
      border: none;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      background-color: transparent;
      outline: none;
      color: #fff;
      border-bottom: thin solid var(--second-color);
      transition: all 0.5s;

      &::placeholder {
        color: #fff;
      }
      &:focus {
        border-bottom: thin solid var(--primary-color);
      }
    }
  }
  .results-search {
    color: white;
    position: absolute;
    height: 90vh;
    width: 100%;
    background-color: var(--bg-color-second);
    top: 4rem;
    padding: 0.5rem 1rem;
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
  }

  @keyframes show {
    0% {
      width: 80%;
    }
    100% {
      width: 100%;
    }
  }
`;
