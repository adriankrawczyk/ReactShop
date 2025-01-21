import styled from "styled-components";
import OpinionInterface from "../Interfaces/OpinionInterface";

const OpinionElement = styled.div`
  position: relative;
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
`;
const OpinionContent = styled.div`
  font-size: 1.75vmax;
`;

const Author = styled.div`
  position: absolute;
  left: 1vmax;
  top: 1vmax;
`;

const Opinion = ({ content, author }: OpinionInterface) => {
  return (
    <OpinionElement>
      <Author>{author}</Author>
      <OpinionContent>{content}</OpinionContent>
    </OpinionElement>
  );
};

export default Opinion;
