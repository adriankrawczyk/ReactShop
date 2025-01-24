import styled from "styled-components";
import {
  StyleScheme,
  ColorScheme,
  WithTransition,
} from "../../Schemes/StyleScheme";

export const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ContentDisplayer = styled.div`
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

export const FormContainer = styled.div`
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

export const FormTitle = styled.h2`
  margin-top: 10px;
  font-size: 26px;
  color: black;
`;

export const InputWrapper = styled.div`
  position: relative;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
`;

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const IconWrapper = styled.div`
  position: absolute;
  left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  pointer-events: none;
`;

export const ErrorMessage = styled.div`
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

export const Input = styled.input<{ hasError: boolean }>`
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

export const Button = styled.button`
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

export const Divider = styled.div`
  width: 2px;
  height: 100%;
  background-color: ${StyleScheme.borderColor};

  @media (max-width: 768px) {
    display: none;
  }
`;
