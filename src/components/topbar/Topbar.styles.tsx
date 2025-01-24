import styled from "styled-components";
import { ColorScheme } from "../../Schemes/StyleScheme";
import { WithTransition } from "../../Schemes/StyleScheme";

export const TopbarContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 90vw;
  height: 10vh;
  border-bottom: 1px solid #bbb;
`;

export const CartButton = styled.div<{ $active?: boolean; $empty?: boolean }>`
  cursor: pointer;
  width: 8vmin;
  height: 8vmin;
  border: 2px solid #bbb;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $empty, $active }) =>
    $empty ? "white" : $active ? ColorScheme.green : ColorScheme.orange};
  ${WithTransition()}
`;

export const HistoryButton = styled.div<{
  $active?: boolean;
  $empty?: boolean;
}>`
  cursor: pointer;
  width: 8vmin;
  height: 8vmin;
  border: 2px solid #bbb;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $empty, $active }) =>
    $empty ? "white" : $active ? ColorScheme.green : ColorScheme.orange};
  ${WithTransition()}
`;

export const LogoutButton = styled.div`
  cursor: pointer;
  width: 8vmin;
  height: 8vmin;
  border: 2px solid #bbb;
  position: absolute;
  left: 1.5vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${ColorScheme.red};
  ${WithTransition()};
`;

export const RightButtonsContainer = styled.div`
  position: absolute;
  right: 1.5vw;
  display: flex;
  gap: 2vw;
  align-items: center;
  height: 100%;
`;

export const InputContainer = styled.div`
  position: absolute;
  transform: translateX(5vw);
  width: 40vw;
  height: 10vh;
  display: flex;
  align-items: center;
`;

export const SpinnerContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: ${ColorScheme.green};
  border-radius: 50%;
  width: 3vmax;
  height: 3vmax;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Input = styled.input<{ isLoading?: boolean }>`
  width: 100%;
  height: 100%;
  border: 1px solid #bbb;
  font-size: 2vmax;
  padding-left: 1vw;
  padding-right: 13vw;
  outline: none;
  display: ${({ isLoading }) => (isLoading ? "none" : "block")};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const InputIconContainer = styled.div`
  position: absolute;
  right: 1vmax;
  font-size: 2vmax;
  display: flex;
  align-items: center;
  gap: 2px;

  @media (max-width: 480px) {
    font-size: 12px;
    right: 0.5vmax;
    align-items: flex-start;
    height: 28px;
    overflow: visible;
    width: auto;
  }
`;

export const StarsContainer = styled.div`
  display: flex;
  gap: 2px;
  padding: 0 2px;
  border-radius: 4px;

  @media (max-width: 480px) {
    flex-wrap: wrap;
    width: 50px;
    gap: 1px;
    padding: 2px;
  }
`;
