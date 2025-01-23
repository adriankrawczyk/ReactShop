/* eslint-disable react-hooks/exhaustive-deps */
import styled from "styled-components";
import { useAppContext } from "../AppContext";
import { useEffect } from "react";
import { ColorScheme } from "../Schemes/StyleScheme";

const SideBarContainer = styled.div`
  position: absolute;
  top: 15vh;
  width: 12vw;
  height: 80vh;
  border-right: 1px solid #bbb;
`;

const CategoryBar = styled.div<{ $active: boolean }>`
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #bbb;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  flex-wrap: wrap;
  text-wrap: nowrap;
  background-color: ${({ $active }) =>
    $active ? ColorScheme.green : "transparent"};
  cursor: pointer;
  transition: font-size 0.25s ease-in-out;
  font-size: 1.2vw;
  &:hover {
    font-size: 1.33vw;
  }
`;

const SideBar = () => {
  const { data, activeCategoryArray, setActiveCategoryArray } = useAppContext();

  const uniqueCategories = [
    ...new Set(
      data.map(({ category }) =>
        category ? category.charAt(0).toUpperCase() + category.slice(1) : 0
      )
    ),
  ];

  useEffect(() => {
    setActiveCategoryArray(new Array(uniqueCategories.length).fill(false));
  }, [uniqueCategories.length]);

  const handleCategoryClick = (index: number) => {
    const updatedActiveArray = [...activeCategoryArray];
    updatedActiveArray[index] = !updatedActiveArray[index];
    setActiveCategoryArray(updatedActiveArray);
  };

  return (
    <SideBarContainer>
      {uniqueCategories.map((category, index) => {
        return (
          <CategoryBar
            $active={activeCategoryArray[index]}
            key={index}
            onClick={() => handleCategoryClick(index)}
          >
            {category}
          </CategoryBar>
        );
      })}
    </SideBarContainer>
  );
};

export default SideBar;
