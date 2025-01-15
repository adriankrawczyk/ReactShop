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

const BuyButton = styled.div`
  width: 75px;
  height: 75px;
  border: 1px solid #bbb;
  position: absolute;
  background-color: rgb(255, 194, 181);
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
  background-color: rgb(255, 243, 187);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 1.5em;
`;

const HomeScreen = () => {
  const { cart, data } = useAppContext();
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    setTotalPrice(0);
    data.forEach((e) => {
      if (cart.includes(e.title)) setTotalPrice((p) => p + parseFloat(e.price));
    });
    setTotalPrice((p) => Math.round(p * 100) / 100);
  }, [cart, data]);

  return (
    <HomeWrapper>
      <MainBox>
        <Topbar></Topbar>
        <SideBar></SideBar>
        <ContentContainer>
          <PriceDisplayer>{totalPrice}$</PriceDisplayer>
          <ContentDisplayer>
            <ItemMapper></ItemMapper>
          </ContentDisplayer>
          <BuyButton>Buy</BuyButton>
        </ContentContainer>
      </MainBox>
    </HomeWrapper>
  );
};

export default HomeScreen;
