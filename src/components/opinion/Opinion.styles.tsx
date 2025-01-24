import styled from "styled-components";
import {
  ColorScheme,
  StyleScheme,
  WithTransition,
} from "../../Schemes/StyleScheme";

export const OpinionElement = styled.div`
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

export const OpinionContent = styled.div`
  font-size: 1.75vmax;
`;

export const Author = styled.div`
  position: absolute;
  left: 1vmax;
  top: 1vmax;
`;

export const DeleteButton = styled.div`
  position: absolute;
  right: 1vmax;
  top: 1vmax;
  width: 2vmax;
  height: 2vmax;
  border: 2px solid ${StyleScheme.borderColor};
  background-color: ${ColorScheme.red};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ${WithTransition()}
`;

export const StarContainer = styled.div`
  position: absolute;
  right: 0.5vmax;
  bottom: 0.5vmax;
`;
