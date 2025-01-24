import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faExclamationCircle,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { HomeWrapper, MainBox } from "../../components/components";
import {
  ContentContainer,
  ContentDisplayer,
  FormContainer,
  FormTitle,
  InputWrapper,
  InputContainer,
  IconWrapper,
  ErrorMessage,
  Input,
  Button,
  Divider,
} from "./LoginScreen.styles";
import { useLoginScreenLogic } from "./useLogicScreenLogic";

const LoginScreen = () => {
  const {
    isLogin,
    setIsLogin,
    username,
    setUsername,
    password,
    setPassword,
    email,
    setEmail,
    errors,
    apiError,
    handleSubmit,
  } = useLoginScreenLogic();

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("logged_user")?.length) {
      navigate("/shop");
    }
  }, [navigate]);

  return (
    <HomeWrapper>
      <MainBox>
        <ContentContainer>
          <ContentDisplayer>
            <FormContainer>
              <FormTitle>{isLogin ? "Login" : "Sign Up"}</FormTitle>
              <form onSubmit={handleSubmit}>
                <InputWrapper>
                  <InputContainer>
                    <IconWrapper>
                      <FontAwesomeIcon icon={faUser} />
                    </IconWrapper>
                    <Input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      hasError={!!errors.username}
                    />
                  </InputContainer>
                  {errors.username && (
                    <ErrorMessage>
                      <FontAwesomeIcon icon={faExclamationCircle} />
                      {errors.username}
                    </ErrorMessage>
                  )}
                </InputWrapper>
                {!isLogin && (
                  <InputWrapper>
                    <InputContainer>
                      <IconWrapper>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </IconWrapper>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        hasError={!!errors.email}
                      />
                    </InputContainer>
                    {errors.email && (
                      <ErrorMessage>
                        <FontAwesomeIcon icon={faExclamationCircle} />
                        {errors.email}
                      </ErrorMessage>
                    )}
                  </InputWrapper>
                )}
                <InputWrapper>
                  <InputContainer>
                    <IconWrapper>
                      <FontAwesomeIcon icon={faLock} />
                    </IconWrapper>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      hasError={!!errors.password}
                    />
                  </InputContainer>
                  {errors.password && (
                    <ErrorMessage>
                      <FontAwesomeIcon icon={faExclamationCircle} />
                      {errors.password}
                    </ErrorMessage>
                  )}
                </InputWrapper>
                <Button type="submit">{isLogin ? "Login" : "Sign Up"}</Button>
                {apiError && (
                  <ErrorMessage>
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    {apiError}
                  </ErrorMessage>
                )}
              </form>
            </FormContainer>
            <Divider />
            <FormContainer>
              <FormTitle>
                {isLogin ? "New Here?" : "Already Have an Account?"}
              </FormTitle>
              <Button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Create Account" : "Go back"}
              </Button>
            </FormContainer>
          </ContentDisplayer>
        </ContentContainer>
      </MainBox>
    </HomeWrapper>
  );
};

export default LoginScreen;
