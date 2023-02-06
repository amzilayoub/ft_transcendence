import useSWR from "swr";

import { fetcher } from "@utils/swr.fetcher";

const useUserStats = (userID: number, shouldFetch: boolean = true) => {
  const { data, error, isLoading, isValidating } = useSWR<{
    gamesPlayed: number;
    wins: number;
    losses: number;
  } | null>(userID !== undefined && shouldFetch ? `/games/stats/${userID}` : null, fetcher);

  return {
    data,
    isLoading: isLoading,
    isValidating: isValidating,
    error: error,
  };
};

export default useUserStats;
