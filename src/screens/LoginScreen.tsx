/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, FormEvent, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { HomeWrapper, MainBox } from "../components/components";
import {
  StyleScheme,
  ColorScheme,
  WithTransition,
} from "../Schemes/StyleScheme";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  permissions: string[];
  password: string;
}

interface Errors {
  username?: string;
  password?: string;
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
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
`;

const LoginScreen = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState<string>("");
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
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setApiError(errorData.message || "Failed to fetch users");
        return;
      }

      const users: User[] = await response.json();
      const user = users.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        setApiError("");
        localStorage.setItem("logged_user", username);
        navigate("/shop");
      } else {
        setApiError("Invalid username or password");
      }
    } catch (error) {
      console.error("Error during API request:", error);
      setApiError("An error occurred. Please try again later.");
    }
  };
  const automaticLog = () => {
    if (localStorage.getItem("logged_user")?.length) {
      navigate("/shop");
    }
  };

  useEffect(() => {
    automaticLog();
  }, []);

  return (
    <HomeWrapper>
      <MainBox>
        <ContentContainer>
          <ContentDisplayer>
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
              <Button type="submit">Login</Button>
              {apiError && (
                <ErrorMessage>
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {apiError}
                </ErrorMessage>
              )}
            </form>
          </ContentDisplayer>
        </ContentContainer>
      </MainBox>
    </HomeWrapper>
  );
};

export default LoginScreen;
