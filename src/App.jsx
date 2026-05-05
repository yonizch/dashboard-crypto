import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CryptoDetails from "./pages/CryptoDetails";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-900 min-h-screen text-white">
        <header className="border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2">
            <span className="text-xl">📈</span>
            <Link to="/" className="text-lg font-bold text-white hover:text-blue-400 transition-colors">
              CryptoDash
            </Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coin/:id" element={<CryptoDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
