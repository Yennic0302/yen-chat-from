import React from "react";
import styled from "styled-components";
import { BiPowerOff } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
const Logut = () => {
  const navigate = useNavigate();

  const handleClick = async () => {
    localStorage.removeItem("yen-app-user");
    navigate("/login");
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
};

export default Logut;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-tracks: center;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
