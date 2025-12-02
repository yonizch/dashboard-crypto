import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CryptoDetails from "./pages/CryptoDetails";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-900 min-h-screen text-white p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coin/:id" element={<CryptoDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
