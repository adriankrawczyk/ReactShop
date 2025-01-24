import { useState, FormEvent, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faExclamationCircle,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { HomeWrapper, MainBox } from "../components/components";
import {
  StyleScheme,
  ColorScheme,
  WithTransition,
} from "../Schemes/StyleScheme";
import { useNavigate } from "react-router-dom";

interface Errors {
  username?: string;
  password?: string;
  email?: string;
}

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
  border-radius: ${StyleScheme.borderRadius};
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 70vw;
    height: auto;
    padding: 20px;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 45%;

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;

const FormTitle = styled.h2`
  margin-top: 10px;
  font-size: 26px;
  color: black;
`;

const InputWrapper = styled.div`
  position: relative;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  pointer-events: none;
`;

const ErrorMessage = styled.div`
  color: #d9534f;
  font-size: 14px;
  margin-top: 5px;
  padding: 5px 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c2c7;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input<{ hasError: boolean }>`
  width: 300px;
  height: 40px;
  padding-left: 40px;
  padding-right: 10px;
  font-size: 16px;
  border: 2px solid
    ${(props) => (props.hasError ? "#d9534f" : StyleScheme.borderColor)};
  outline: none;
  font-weight: 600;
  background-color: ${(props) => (props.hasError ? "#f8d7da" : "white")};
  &::placeholder {
    color: #bbb;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 15px;
  background-color: ${ColorScheme.green};
  border: none;
  border-radius: ${StyleScheme.borderRadius};
  border: 2px solid ${StyleScheme.borderColor};
  font-size: 16px;
  cursor: pointer;
  ${WithTransition()}

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Divider = styled.div`
  width: 2px;
  height: 100%;
  background-color: ${StyleScheme.borderColor};

  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const validateForm = (): Errors => {
    const errors: Errors = {};
    if (!username.trim()) {
      errors.username = "Username is required";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (!isLogin && !email.trim()) {
      errors.email = "Email is required";
    }
    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError("");
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (isLogin) {
        const response = await fetch("http://localhost:5000/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setApiError(errorData.message || "Invalid username or password");
          return;
        }

        const { token, isAdmin } = await response.json();
        localStorage.setItem("isAdmin", isAdmin ? "admin" : "");
        localStorage.setItem("token", token);
        localStorage.setItem("logged_user", username);
        navigate("/shop");
      } else {
        const response = await fetch("http://localhost:5000/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            email,
            isAdmin: false,
            permissions: ["read"],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setApiError(errorData.message || "Failed to create account");
          return;
        }
        const { token, isAdmin } = await response.json();
        localStorage.setItem("isAdmin", isAdmin ? "admin" : "");
        localStorage.setItem("token", token);
        localStorage.setItem("logged_user", username);
        navigate("/shop");
      }
    } catch (error) {
      console.error("Error during API request:", error);
      setApiError("An error occurred. Please try again later.");
    }
  };

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
