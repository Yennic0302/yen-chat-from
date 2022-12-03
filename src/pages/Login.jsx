import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import Logo from "../assets/Logo.png";
import Loader from "../assets/loader.gif";
import { Link, useNavigate } from "react-router-dom";
import { helpHttp } from "../helpers/helpHttp";
import Modal from "../components/Modal";

const initialState = {
  username: "",
  password: "",
};

const toastOptions = {
  position: "bottom-right",
  autoClose: 2000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

export default function Login() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleValidation = () => {
    const { username, password } = form;

    if (username === "") {
      toast.error("username is required", toastOptions);
      return false;
    }

    if (password.length === "") {
      toast.error("password is required", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      let options = {
        headers: {
          "Content-type": "application/json",
        },
        method: "POST",
        body: form,
      };
      setLoading(true);
      helpHttp()
        .post(loginRoute, options)
        .then((request) => {
          if (!request.error) {
            if (request.status) {
              setLoading(false);
              localStorage.setItem(
                "yen-app-user",
                JSON.stringify(request.user)
              );
              toast.success(request.msg, toastOptions);
              setTimeout(() => {
                if (request.user.isAvatarImageSet) navigate("/chat");
                else navigate("/set-avatar");
              }, 3000);
            } else {
              toast.error(request.msg, toastOptions);
              setLoading(false);
            }
          } else {
            toast.error(request.statusText, toastOptions);
            setLoading(false);
          }
        });
    }
  };

  useEffect(() => {
    const validateLogin = async () => {
      let user = await JSON.parse(localStorage.getItem("yen-app-user"));
      if (user) {
        if (!user.isAvatarImageSet) return navigate("/set-avatar");
        else return navigate("/chat");
      }
    };
    validateLogin();
  }, []);

  return (
    <>
      {loading && (
        <Modal>
          <img src={Loader} alt="" />
        </Modal>
      )}
      <FormConatiner>
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h1>Yen Chat</h1>
          </div>
          <input
            type="text"
            placeholder="Username "
            name="username"
            onChange={handleChange}
            value={form.username}
            min="3"
          />

          <input
            type="password"
            placeholder="Password "
            name="password"
            onChange={handleChange}
          />

          <button type="submit"> Login</button>
          <span>
            do you not have an account? <Link to="/register">Register</Link>
          </span>
        </form>
      </FormConatiner>
      <ToastContainer />
    </>
  );
}

const FormConatiner = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-color-primary);
  .brand {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: var(--bg-color-second);
    img {
      width: 3rem;
      height: 3rem;
    }
    h1 {
      padding-left: 1rem;
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: var(--bg-color-second);
    border-radius: 2rem;
    padding: 2rem 2rem;

    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid var(--primary-color);
      border-radius: 0.4rem;
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid var(--second-color);
        outline: none;
      }
    }

    button {
      background-color: var(--bg-color-second);
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
    span {
      color: white;
      text-transform: uppercase;
      a {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;
