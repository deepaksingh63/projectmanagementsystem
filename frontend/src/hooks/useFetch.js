import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const useFetch = (fetcher, immediate = true, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetcherRef.current();
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      run().catch(() => {});
    }
  }, [immediate, run, ...deps]);

  return { data, loading, error, run, setData };
};

export default useFetch;
