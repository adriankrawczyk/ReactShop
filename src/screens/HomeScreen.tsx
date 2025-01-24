import {
  HomeWrapper,
  MainBox,
  ContentDisplayer,
  ContentContainer,
} from "../components/components";
import ItemMapper from "../components/ItemMapper";
import Topbar from "../components/Topbar";
import SideBar from "../components/SideBar";
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
