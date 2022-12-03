import ReactDOM from "react-dom";
import styled from "styled-components";

const Modal = ({ children }) => {
  return ReactDOM.createPortal(
    <Conatiner>
      <div>{children}</div>
    </Conatiner>,
    document.getElementById("modal")
  );
};

export default Modal;

const Conatiner = styled.div`
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color-second);
  z-index: 999;
`;
