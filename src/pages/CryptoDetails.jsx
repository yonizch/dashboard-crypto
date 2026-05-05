import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import useFetch from "../hooks/useFetch";
import Loader from "../components/Loader";
import SecondaryButton from "../components/SecondaryButton";

const PERIODS = [
  { label: "7J", days: 7 },
  { label: "30J", days: 30 },
  { label: "90J", days: 90 },
  { label: "1A", days: 365 },
];

const formatDate = (timestamp, days) => {
  const date = new Date(timestamp);
  if (days <= 30) {
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  }
  return date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
};

const formatPrice = (value) => {
  if (value >= 1000) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (value >= 1) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 6 })}`;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm shadow-lg">
        <p className="text-gray-400">{payload[0].payload.date}</p>
        <p className="text-blue-400 font-semibold">{formatPrice(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const CryptoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState(30);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState(null);

  const coinUrl = `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`;
  const { data: coin, loading, error } = useFetch(coinUrl);

  useEffect(() => {
    if (!id) return;
    setChartLoading(true);
    setChartError(null);

    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${activePeriod}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const formatted = json.prices.map(([timestamp, price]) => ({
          timestamp,
          price,
          date: formatDate(timestamp, activePeriod),
        }));
        setChartData(formatted);
      })
      .catch((err) => setChartError(err.message))
      .finally(() => setChartLoading(false));
  }, [id, activePeriod]);

  if (loading) return <Loader />;
  if (error) return <p className="mt-4 text-red-400">Erreur : {error}</p>;
  if (!coin) return null;

  const description = coin.description?.en
    ? coin.description.en.replace(/<[^>]+>/g, "").split(". ").slice(0, 3).join(". ") + "."
    : "Aucune description disponible.";

  const change24h = coin.market_data?.price_change_percentage_24h;
  const isPositive = change24h >= 0;

  const priceMin = chartData.length ? Math.min(...chartData.map((d) => d.price)) : 0;
  const priceMax = chartData.length ? Math.max(...chartData.map((d) => d.price)) : 0;
  const chartMin = priceMin * 0.99;
  const chartMax = priceMax * 1.01;

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-6">
        <SecondaryButton text="← Retour" onClick={() => navigate(-1)} />
      </div>

      {/* En-tête coin */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={coin.image?.large}
          alt={coin.name}
          className="w-14 h-14 rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold">{coin.name}</h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            {coin.symbol}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-bold">
            {formatPrice(coin.market_data?.current_price?.usd ?? 0)}
          </p>
          <p className={`text-sm font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? "▲" : "▼"} {Math.abs(change24h).toFixed(2)}% (24h)
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {[
          {
            label: "Capitalisation",
            value: `$${(coin.market_data?.market_cap?.usd ?? 0).toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 })}`,
          },
          {
            label: "Volume 24h",
            value: `$${(coin.market_data?.total_volume?.usd ?? 0).toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 })}`,
          },
          {
            label: "ATH",
            value: formatPrice(coin.market_data?.ath?.usd ?? 0),
          },
          {
            label: "Plus bas 24h",
            value: formatPrice(coin.market_data?.low_24h?.usd ?? 0),
          },
          {
            label: "Plus haut 24h",
            value: formatPrice(coin.market_data?.high_24h?.usd ?? 0),
          },
          {
            label: "Rang",
            value: `#${coin.market_cap_rank ?? "—"}`,
          },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-800 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">{label}</p>
            <p className="font-semibold text-sm">{value}</p>
          </div>
        ))}
      </div>

      {/* Graphique */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-300">Prix historique (USD)</h2>
          <div className="flex gap-1">
            {PERIODS.map(({ label, days }) => (
              <button
                key={days}
                onClick={() => setActivePeriod(days)}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                  activePeriod === days
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {chartLoading ? (
          <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
            Chargement du graphique...
          </div>
        ) : chartError ? (
          <div className="h-48 flex items-center justify-center text-red-400 text-sm">
            Impossible de charger le graphique
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[chartMin, chartMax]}
                tickFormatter={formatPrice}
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#3b82f6" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Description */}
      {coin.description?.en && (
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-300 mb-2">À propos</h2>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
      )}
    </div>
  );
};

export default CryptoDetails;
