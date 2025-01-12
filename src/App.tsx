import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomeScreen />} />
    </Routes>
  </BrowserRouter>
);

export default App;
