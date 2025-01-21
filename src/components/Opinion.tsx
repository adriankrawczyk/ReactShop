import styled from "styled-components";

const OpinionElement = styled.div`
  display: flex;
  width: 90%;
  margin-bottom: 3.5vh;
  height: 120px;
  background: linear-gradient(
    200deg,
    rgba(210, 232, 255, 1) 0%,
    rgba(225, 241, 255, 1) 100%
  );
  border: 2px solid #bbb;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2vmax;
`;

const Opinion = ({ content }: { content: string }) => {
  return <OpinionElement>{content}</OpinionElement>;
};

export default Opinion;
