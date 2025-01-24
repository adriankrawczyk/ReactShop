import styled from "styled-components";

export const ItemMapperWrapper = styled.div`
  padding-top: 3.5vh;
  padding-bottom: 3.5vh;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
`;

export const NoOpinionsMessage = styled.div`
  font-size: 1.2rem;
  color: #666;
  margin-top: 20px;
  text-align: center;
`;

export const ErrorMessage = styled.div`
  color: #ff4444;
  margin: 20px;
  text-align: center;
  font-size: 1.1rem;
`;
