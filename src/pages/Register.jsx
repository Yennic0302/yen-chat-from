import { useState, useEffect } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";
import Logo from "../assets/Logo.png";
import Loader from "../assets/loader.gif";
import { Link, useNavigate } from "react-router-dom";
import { helpHttp } from "../helpers/helpHttp";
import Modal from "../components/Modal";

const initialState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const toastOptions = {
  position: "bottom-right",
  autoClose: 2000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

export default function Register() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("yen-app-user")) {
      navigate("/chat");
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = form;

    if (password !== confirmPassword) {
      toast.error("password and confirm password should be same", toastOptions);
      return false;
    }

    if (username.length < 3) {
      toast.error("username should be greater than 3 characters", toastOptions);
      return false;
    }

    if (password.length < 8) {
      toast.error(
        "password should be equal or greater than 8 characters",
        toastOptions
      );
      return false;
    }

    if (email === "") {
      toast.error("email is required", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      setLoading(true);
      let options = {
        headers: {
          "Content-Type": "application/json",
        },
        body: form,
      };

      helpHttp()
        .post(registerRoute, options)
        .then((request) => {
          if (!request.error) {
            if (request.status) {
              console.log(request);
              localStorage.setItem(
                "yen-app-user",
                JSON.stringify(request.user)
              );
              setLoading(false);
              toast.success(request.msg, toastOptions);
              setTimeout(() => {
                navigate("/login");
              }, 2000);
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
            <h1>Yen App</h1>
          </div>
          <input
            required
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />
          <input
            required
            type="password"
            placeholder="Password "
            name="password"
            onChange={handleChange}
          />
          <input
            required
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
          />

          <button type="submit"> Create User</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
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
    padding: 1rem 2rem;

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
