import styled from "styled-components";
import { ColorScheme } from "../../Schemes/StyleScheme";

export const SideBarContainer = styled.div`
  position: absolute;
  top: 15vh;
  width: 12vw;
  height: 80vh;
  border-right: 1px solid #bbb;
`;

export const CategoryBar = styled.div<{ $active: boolean }>`
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
  font-size: 1.2vw;
  &:hover > div {
    transform: scale(1.1);
    transition: transform 0.25s ease-in-out;
  }
`;

export const BuyText = styled.div``;

export const BuyButton = styled.div`
  width: 12vw;
  height: 75px;
  border: 1px solid #bbb;
  position: absolute;
  background-color: ${ColorScheme.red};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 2.5vmax;
  cursor: pointer;
  border-bottom-left-radius: 15%;
  bottom: 0;
  &:hover > div {
    transition: transform 0.25s ease-in-out;
    transform: scale(1.125);
  }
`;

export const PriceDisplayer = styled.div`
  width: 12vw;
  min-height: 75px;
  border: 1px solid #bbb;
  bottom: 75px;
  left: 0;
  border-bottom: 0;
  border-left: 0;
  position: absolute;
  background-color: ${ColorScheme.orange};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  padding: 8px;
  text-align: center;
  font-size: max(2vmax, 2.5vh);
  line-height: 1.2;
  word-break: break-word;
  overflow-wrap: anywhere;
  hyphens: auto;
  display: grid;
  place-items: center;
`;
