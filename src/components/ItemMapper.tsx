import Item from "./Item";
import styled from "styled-components";

const ItemMapperWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ItemMapper = () => {
  return (
    <ItemMapperWrapper>
      <Item></Item>
    </ItemMapperWrapper>
  );
};
export default ItemMapper;
