import styled from "styled-components";
import { useAppContext } from "../AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

const TopbarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 90vw;
  height: 10vh;
  border-bottom: 1px solid #bbb;
`;

const InputContainer = styled.div`
  width: 50vw;
  height: 10vh;
  margin-left: 10vw;
  display: flex;
  align-items: center;
`;
const Input = styled.input`
  width: 100%;
  height: 100%;
  border-right: 1px solid #bbb;
  border-left: 1px solid #bbb;
  border-top: 0;
  border-bottom: 0;
`;

const CartButton = styled.div`
  cursor: pointer;
  width: 50px;
  height: 50px;
  border: 2px solid #bbb;
  position: absolute;
  right: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(187, 255, 187);
`;

const Topbar = () => {
  const { setInputValue } = useAppContext();
  return (
    <TopbarContainer>
      <InputContainer>
        <Input onChange={(e) => setInputValue(e.target.value)}></Input>
      </InputContainer>
      <CartButton>
        <FontAwesomeIcon style={{ fontSize: "2em" }} icon={faCartShopping} />
      </CartButton>
    </TopbarContainer>
  );
};

export default Topbar;
