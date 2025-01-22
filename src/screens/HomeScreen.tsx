import {
  HomeWrapper,
  MainBox,
  ContentDisplayer,
  ContentContainer,
} from "../components/components";
import ItemMapper from "../components/ItemMapper";
import Topbar from "../components/Topbar";
import SideBar from "../components/SideBar";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { ColorScheme } from "../Schemes/StyleScheme";
const BuyButton = styled.div`
  width: 75px;
  height: 75px;
  border: 1px solid #bbb;
  position: absolute;
  background-color: ${ColorScheme.red};
  border-bottom-right-radius: 15%;
  right: 0px;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 2em;
  cursor: pointer;
`;
const PriceDisplayer = styled.div`
  width: 12vw;
  height: 75px;
  border: 1px solid #bbb;
  bottom: 0;
  left: -12vw;
  border-bottom-left-radius: 15%;
  border-bottom: 0;
  border-left: 0;
  position: absolute;
  background-color: ${ColorScheme.orange};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 1.5em;
`;

const HomeScreen = () => {
  const { cart, data, bought, setBought, setCart } = useAppContext();
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    setTotalPrice(0);
    data.forEach((e) => {
      const cartItem = cart.find((item) => item.title === e.title);
      if (cartItem) {
        setTotalPrice((p) => p + parseFloat(e.price) * cartItem.quantity);
      }
    });
    setTotalPrice((p) => Math.round(p * 100) / 100);
  }, [cart, data]);
  return (
    <HomeWrapper>
      <MainBox>
        <Topbar></Topbar> <SideBar></SideBar>
        <ContentContainer>
          <PriceDisplayer>{totalPrice}$</PriceDisplayer>
          <ContentDisplayer>
            <ItemMapper></ItemMapper>
          </ContentDisplayer>
          <BuyButton
            onClick={() => {
              // setBought([...bought, ...cart]);
              setCart([]);
            }}
          >
            Buy
          </BuyButton>
        </ContentContainer>
      </MainBox>
    </HomeWrapper>
  );
};
export default HomeScreen;
