import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loader from "../components/Loader";
import SecondaryButton from "../components/SecondaryButton";

const CryptoDetails = () => {
  const params = useParams();
  const apiCoin = `https://api.coingecko.com/api/v3/coins/${params.id}`;
  const { data: coin, loading, error } = useFetch(apiCoin);
  console.log(coin);
  const navigate = useNavigate();
  const handleRetour = () => {
    navigate(-1);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="mt-4 text-red-400">Erreur : {error.message}</p>;
  }
  let parts = "";
  if (coin.description.en) {
    parts = coin.description.en.split(".");
  }
  let shortDescription = parts[0] + ".";
  if (parts[1]) {
    shortDescription += parts[1] + ".";
  }
  if (parts[2]) {
    shortDescription += parts[2] + ".";
  }
  return (
    <>
      <div className="ml-1">
        <SecondaryButton text="< Return" onClick={handleRetour} />
      </div>
      <div className="p-4 max-w-3xl mx-auto">
        <div className="text-center text-3xl font-bold mb-4 ">{coin.name} </div>
        <div className="flex items-center gap-3">
          <img src={coin.image.small} alt={coin.name}></img>
          <div>
            <p className="text-gray-400 text-lg">{coin.symbol.toUpperCase()}</p>
          </div>
        </div>
        <p className="mt-2">
          Current Price: ${coin.market_data.current_price.usd.toLocaleString()}
        </p>
        <p className="text-red-400 mt-5">Description: {shortDescription}</p>
      </div>
    </>
  );
};

export default CryptoDetails;
