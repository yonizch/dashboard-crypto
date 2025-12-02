import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loader from "../components/Loader";

export default function Home() {
  const apiCrypto =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false";

  const { data, loading, error } = useFetch(apiCrypto);
  const navigate = useNavigate();

  // console.log(data);
  if (loading) {
    <Loader />;
  }

  if (error) {
    return <p className="mt-4 text-red-400">Erreur : {error.message}</p>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Top 50 cryptos</h2>
      {/* grille espace de 4 1colonne 2colonnes pour ecran tablette 640px 3colonnes pour ecran > 1024px */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((crypto) => (
          <div
            key={crypto.id}
            className="bg-gray-800 p-4 cursor-pointer"
            onClick={() => navigate(`/coin/${crypto.id}`)}
          >
            <div className="flex items-center gap-3">
              <img
                src={crypto.image}
                alt={crypto.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{crypto.name}</h3>
                <p className="text-gray-400 text-sm">
                  {crypto.symbol.toUpperCase()}
                </p>
              </div>
            </div>
            <p className="mt-2">
              Price: ${crypto.current_price.toLocaleString()}
            </p>

            <p
              className={
                crypto.price_change_percentage_24h >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
