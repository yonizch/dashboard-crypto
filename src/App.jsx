import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-900 min-h-screen text-white p-4">
        <h1 className="text-3xl font-bold">Dashboard Crypto</h1>
        <p className="mt-2 text-gray-300">Welcome to your crypto dashboard.</p>

        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
