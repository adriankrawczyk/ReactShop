import styled from "styled-components";
import { StyleScheme } from "../Schemes/StyleScheme";

const ItemElement = styled.div`
  margin-top: 3.5vh;
  width: 90%;
  height: 100px;
  background: linear-gradient(
    200deg,
    rgba(210, 232, 255, 1) 0%,
    rgba(225, 241, 255, 1) 100%
  );
  box-shadow: ${StyleScheme.boxShadow};
  border: 2px solid #bbb;
`;

const Item = () => {
  return (
    <>
      <ItemElement></ItemElement>
    </>
  );
};

export default Item;
