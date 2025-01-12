import styled from "styled-components";
import { StyleScheme } from "../Schemes/StyleScheme";
import ItemMapper from "../components/ItemMapper";

const HomeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;
const MainBox = styled.div`
  flex-direction: column;
  height: 90vh;
  width: 90vw;
  background: linear-gradient(
    200deg,
    rgba(210, 232, 255, 1) 0%,
    rgba(225, 241, 255, 1) 100%
  );
  box-shadow: ${StyleScheme.boxShadow};
  border-radius: ${StyleScheme.borderRadius};
`;
const Topbar = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  width: 90vw;
  height: 10vh;
  border-bottom: 1px solid #bbb;
`;

const SideBar = styled.div`
  position: absolute;
  top: 15vh;
  width: 12vw;
  height: 80vh;
  border-right: 1px solid #bbb;
`;

const ContentContainer = styled.div`
  position: absolute;
  left: 17vw;
  top: 15vh;
  width: 78vw;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentDisplayer = styled.div`
  width: 72vw;
  height: 72vh;
  background-color: white;
  box-shadow: ${StyleScheme.boxShadow};
  border-radius: ${StyleScheme.borderRadius} 0 0 ${StyleScheme.borderRadius};
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
`;

const HomeScreen = () => {
  return (
    <HomeWrapper>
      <MainBox>
        <Topbar></Topbar>
        <SideBar></SideBar>
        <ContentContainer>
          <ContentDisplayer>
            <ItemMapper></ItemMapper>
          </ContentDisplayer>
        </ContentContainer>
      </MainBox>
    </HomeWrapper>
  );
};

export default HomeScreen;
