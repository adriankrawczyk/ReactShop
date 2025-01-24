import {
  HomeWrapper,
  MainBox,
  ContentDisplayer,
  ContentContainer,
} from "../../components/components";
import ItemMapper from "../../components/itemMapper/ItemMapper";
import Topbar from "../../components/topbar/Topbar";
import SideBar from "../../components/sideBar/SideBar";
import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("logged_user")?.length) navigate("/");

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
