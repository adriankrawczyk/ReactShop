import { HomeWrapper, MainBox } from "../components/components";
import styled from "styled-components";
import { StyleScheme } from "../Schemes/StyleScheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentDisplayer = styled.div`
  width: 80vw;
  height: 80vh;
  background-color: white;
  box-shadow: ${StyleScheme.boxShadow};
  border-radius: ${StyleScheme.borderRadius} ${StyleScheme.borderRadius}
    ${StyleScheme.borderRadius} ${StyleScheme.borderRadius};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  position: relative;
  margin: 10px 0;
`;

const Input = styled.input`
  width: 300px;
  height: 40px;
  padding-left: 40px; /* Space for the icon */
  padding-right: 10px;
  font-size: 16px;
  border: 2px solid ${StyleScheme.borderColor};
  outline: none;
 font-weight: 600;
  &::placeholder {
    color: #bbb
    };
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
`;

const LoginScreen = () => {
  return (
    <HomeWrapper>
      <MainBox>
        <ContentContainer>
          <ContentDisplayer>
            <InputWrapper>
              <IconWrapper>
                <FontAwesomeIcon icon={faUser} />
              </IconWrapper>
              <Input type="text" placeholder="Username" />
            </InputWrapper>
            <InputWrapper>
              <IconWrapper>
                <FontAwesomeIcon icon={faLock} />
              </IconWrapper>
              <Input type="password" placeholder="Password" />
            </InputWrapper>
          </ContentDisplayer>
        </ContentContainer>
      </MainBox>
    </HomeWrapper>
  );
};

export default LoginScreen;
