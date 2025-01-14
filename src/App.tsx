import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/shop" element={<HomeScreen />} />
      <Route path="/" element={<LoginScreen />} />
    </Routes>
  </BrowserRouter>
);

export default App;
