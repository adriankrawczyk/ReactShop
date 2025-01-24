import { useSideBarLogic } from "./useSideBarLogic";
import {
  SideBarContainer,
  CategoryBar,
  BuyText,
  BuyButton,
  PriceDisplayer,
} from "./SideBar.styles";

const SideBar = () => {
  const {
    totalPrice,
    handleBuy,
    handleCategoryClick,
    uniqueCategories,
    activeCategoryArray,
  } = useSideBarLogic();

  return (
    <SideBarContainer>
      {uniqueCategories.map((category, index) => {
        return (
          <CategoryBar
            $active={activeCategoryArray[index]}
            key={index}
            onClick={() => handleCategoryClick(index)}
          >
            <div>{category}</div>
          </CategoryBar>
        );
      })}
      <PriceDisplayer>
        <span>{totalPrice}$</span>
      </PriceDisplayer>
      <BuyButton onClick={handleBuy}>
        <BuyText>Buy</BuyText>
      </BuyButton>
    </SideBarContainer>
  );
};

export default SideBar;
