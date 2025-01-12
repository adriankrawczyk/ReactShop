import styled from "styled-components";

const TopbarContainer = styled.div`
  display: flex;
  justify-content: center;
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
  border-bottom: 1px solid #bbb;
`;

const Topbar = () => {
  return (
    <TopbarContainer>
      <InputContainer>
        <Input></Input>
      </InputContainer>
    </TopbarContainer>
  );
};

export default Topbar;
