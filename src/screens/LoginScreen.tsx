import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { HomeWrapper, MainBox } from "../components/components";
import { StyleScheme } from "../Schemes/StyleScheme";

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
`;

const Input = styled.input`
  width: 300px;
  height: 40px;
  padding-left: 40px;
  padding-right: 10px;
  font-size: 16px;
  border: 2px solid ${StyleScheme.borderColor};
  outline: none;
  font-weight: 600;
  &::placeholder {
    color: #bbb;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
`;

const LogsContainer = styled.div`
  width: 100%;
  max-height: 300px;
  overflow-y: scroll;
  background-color: #f9f9f9;
  margin-top: 20px;
  padding: 10px;
  border: 1px solid ${StyleScheme.borderColor};
`;

const UserCard = styled.div`
  margin: 10px 0;
  padding: 10px;
  background-color: #fff;
  border: 1px solid ${StyleScheme.borderColor};
  border-radius: ${StyleScheme.borderRadius};
  box-shadow: ${StyleScheme.boxShadow};
`;

const LoginScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users"); // Replace with your backend endpoint
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

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
            <LogsContainer>
              {users.map((user) => (
                <UserCard key={user._id}>
                  <strong>Username:</strong> {user.username} <br />
                  <strong>Email:</strong> {user.email} <br />
                  <strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"} <br />
                  <strong>Permissions:</strong> {user.permissions.join(", ")}
                </UserCard>
              ))}
            </LogsContainer>
          </ContentDisplayer>
        </ContentContainer>
      </MainBox>
    </HomeWrapper>
  );
};

export default LoginScreen;
