import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loader from "../components/Loader";

const API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false";

const SORT_OPTIONS = [
  { id: "market_cap", label: "Capitalisation", key: "market_cap" },
  { id: "price", label: "Prix", key: "current_price" },
  { id: "change", label: "Variation 24h", key: "price_change_percentage_24h" },
  { id: "name", label: "Nom", key: "name" },
];

const formatMarketCap = (value) =>
  `$${value.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 })}`;

export default function Home() {
  const { data, loading, error } = useFetch(API_URL);
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("market_cap");
  const [sortDir, setSortDir] = useState("desc");

  const cryptos = useMemo(() => {
    if (!data) return [];
    const option = SORT_OPTIONS.find((o) => o.id === sortBy);
    const key = option.key;
    const sorted = [...data].sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      if (typeof va === "string") {
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === "asc" ? va - vb : vb - va;
    });
    return sorted;
  }, [data, sortBy, sortDir]);

  if (loading) return <Loader />;
  if (error) return <p className="mt-4 text-red-400">Erreur : {error}</p>;
  if (!data) return null;

  return (
    <div className="mt-2">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-bold mb-1">Top 20 Cryptos</h2>
          <p className="text-gray-400 text-sm">Classées par capitalisation boursière</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Trier par :</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}
            className="bg-gray-800 border border-gray-700 text-sm rounded-lg px-3 py-1.5 hover:bg-gray-700 transition-colors"
            title={sortDir === "desc" ? "Décroissant" : "Croissant"}
          >
            {sortDir === "desc" ? "↓" : "↑"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {cryptos.map((crypto) => {
          const isPositive = crypto.price_change_percentage_24h >= 0;
          return (
            <div
              key={crypto.id}
              className="bg-gray-800 rounded-xl p-4 cursor-pointer border border-transparent hover:border-blue-500 hover:bg-gray-750 transition-all duration-200 group"
              onClick={() => navigate(`/coin/${crypto.id}`)}
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate group-hover:text-blue-400 transition-colors">
                    {crypto.name}
                  </h3>
                  <p className="text-gray-400 text-xs uppercase tracking-wider">
                    {crypto.symbol}
                  </p>
                </div>
                <span className="text-gray-500 text-xs font-medium">
                  #{crypto.market_cap_rank}
                </span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-lg font-bold">
                    ${crypto.current_price.toLocaleString("en-US")}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Cap : {formatMarketCap(crypto.market_cap)}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold px-2 py-0.5 rounded-md ${
                    isPositive
                      ? "text-green-400 bg-green-400/10"
                      : "text-red-400 bg-red-400/10"
                  }`}
                >
                  {isPositive ? "▲" : "▼"} {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
