import useSWR from "swr";

import { fetcher } from "@utils/swr.fetcher";

const useUserStats = (username: string, shouldFetch: boolean = true) => {
  const { data, error, isLoading, isValidating } = useSWR(
    shouldFetch ? `/stats/${username}` : null,
    fetcher
  );

  return {
    data,
    isLoading: isLoading,
    isValidating: isValidating,
    error: error,
  };
};

export default useUserStats;
