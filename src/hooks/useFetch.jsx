import { useEffect, useState } from "react";

const useFetch = (fetchUrl) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!fetchUrl) return;
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw Error("Pas de data");
        }
        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (err) {
        console.log(err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchUrl]);
  return { data, loading, error };
};

export default useFetch;
