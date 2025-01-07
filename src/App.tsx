import { BrowserRouter, Routes, Route } from "react-router-dom";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<></>} />
    </Routes>
  </BrowserRouter>
);

export default App;
