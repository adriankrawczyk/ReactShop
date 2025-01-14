import styled from "styled-components";
import { useAppContext } from "../AppContext";

const SideBarContainer = styled.div`
  position: absolute;
  top: 15vh;
  width: 12vw;
  height: 80vh;
  border-right: 1px solid #bbb;
`;

const CategoryBar = styled.div`
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #bbb;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  flex-wrap: wrap;
`;

const SideBar = () => {
  const { data } = useAppContext();
  const uniqueCategories = [
    ...new Set(
      data.map(
        ({ category }) => category.charAt(0).toUpperCase() + category.slice(1)
      )
    ),
  ];

  return (
    <SideBarContainer>
      {uniqueCategories.map((category, index) => {
        return <CategoryBar key={index}>{category}</CategoryBar>;
      })}
    </SideBarContainer>
  );
};

export default SideBar;
